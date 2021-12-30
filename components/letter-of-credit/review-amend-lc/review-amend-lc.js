define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/view-letter-of-credit",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojvalidation",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojnavigationlist",
  "ojs/ojconveyorbelt",
  "ojs/ojradioset",
  "ojs/ojswitch",
  "ojs/ojpagingcontrol",
  "ojs/ojcheckboxset"
], function (oj, ko, $, ReviewAmendLcModel, resourceBundle) {
  "use strict";

  let self;
  const vm = function (params) {
    self = this;

    let i;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.mode = ko.observable(self.params.mode);

    let countryList = [];

    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("amend-letter-of-credit", "letter-of-credit");
    params.baseModel.registerComponent("attach-documents", "trade-finance");
    self.documentPresentationDays = ko.observable(0);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.resourceBundle.heading.reviewMsg;
    /*for validation groups in amend lc*/
    self.amendLcTracker = ko.observable();
    self.amendLcGroupValid = ko.observable();
    self.amendShipmentTracker = ko.observable();
    self.amendShipmentGroupValid = ko.observable();
    self.amendInsturctionsTracker = ko.observable();
    self.amendInstructionsGroupValid = ko.observable();
    self.tncTracker = ko.observable();
    self.tncGroupValid = ko.observable();
    self.previousValue = ko.observable("");
    self.showDocuments = ko.observable(self.params.showDocuments);
    self.partialShipment = ko.observable(true);
    self.transShipment = ko.observable(true);

    self.sectionHeading = ko.observable();
    self.additionalBankDetails = ko.observable(ko.utils.unwrapObservable(self.params.additionalBankDetails));
    self.additionalIssueBankDetails = ko.observable();
    self.availableWithDetails = ko.observable();
    self.datasourceForDocReview = self.params.datasourceForDocReview;
    self.datasourceForAmendedGoods = ko.observableArray();
    self.partyDetailsloaded = ko.observable(true);
    self.flow = self.params.flow;
    self.prevBeneCountry = ko.observable();

    self.draftArray = ko.observableArray();

    self.datasourceForDraftReview = new oj.ArrayTableDataSource(self.draftArray, {
      idAttribute: "id"
    });

    self.draftArrayOriginal = ko.observableArray();

    self.datasourceForDraftReviewOriginal = new oj.ArrayTableDataSource(self.draftArrayOriginal, {
      idAttribute: "id"
    });

    self.goodsArray = ko.observableArray();

    self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsArray, {
      idAttribute: "code"
    });

    self.multiGoodsSupported = ko.observable(ko.utils.unwrapObservable(self.params.multiGoodsSupported));
    self.billingDraftsLoaded = ko.observable(false);
    self.documentsLoaded = ko.observable(false);
    self.attachedDocuments = ko.observableArray();
    self.clauseTableArrayForReview = [];
    self.selectedClauses = ko.observable();
    self.clauseModalHeading = ko.observable();
    self.applicantName = ko.observable(self.params.applicantName);
    self.creditAvailableWithSelected = ko.observable();
    self.documentDetailsOriginal = ko.observableArray(self.params.documentDetailsOriginal);
    self.isGoodsTableChanged = ko.observable(false);
    self.isDocumentTableChanged = ko.observable(false);
    self.hasDraftTableChanged = ko.observable(false);

    self.isBackFromReview = ko.observable();
    self.confirmationInstructionOptions = self.params.confirmationInstructionOptions;
    self.requestedConfirmationPartyOptions = self.params.requestedConfirmationPartyOptions;
    self.requestedConfirmationPartyMode = self.params.requestedConfirmationPartyMode;
    self.requestedConfirmationPartyDetails = self.params.requestedConfirmationPartyDetails;
    self.confirmationInstructionDes = ko.observable();
    self.requestedConfirmationPartyDes = ko.observable();
    self.setMenuAsAmendment = ko.observable();
    self.lcAmendmentDetails = ko.observable();
    self.dropdownLabels = ko.observable();

    self.datasourceForDocumentsOriginal = new oj.ArrayTableDataSource(self.documentDetailsOriginal, {
      idAttribute: "id"
    });

    function shipment() {
      if (self.lcAmendmentDetails.shipmentDetails.partial() === "" || self.lcAmendmentDetails.shipmentDetails.partial() === null) {
        self.partialShipment(false);
      }

      if (self.lcAmendmentDetails.shipmentDetails.transShipment() === "" || self.lcAmendmentDetails.shipmentDetails.transShipment() === null) {
        self.transShipment(false);
      }
    }

    function getCountryNameFromCode(countryCode) {
      const countryName = countryList.filter(function (data) {
        return data.code === countryCode;
      });

      return countryName.length > 0 ? countryName[0].description : null;
    }

    function setParameters() {

      if (self.params.mode === "ACCEPTANCE") {
        if (self.params.lcAmendmentDetails.validBICCode()) {
          self.creditAvailableWithSelected = ko.observable("SWIFTCODE");
        }
        else {
          self.creditAvailableWithSelected = ko.observable("BANKADDRESS");
        }

      } else {
        self.creditAvailableWithSelected = self.params.creditAvailableWithSelected ? self.params.creditAvailableWithSelected : ko.observable();

      }

      self.availableWithDetails = self.params.availableWithDetails ? self.params.availableWithDetails : ko.observable();

      if (self.params.dropdownLabels) {
        self.dropdownLabels = self.params.dropdownLabels;
      } else {
        self.dropdownLabels = {
          country: ko.observable(),
          product: ko.observable(),
          branch: ko.observable(),
          incoterm: ko.observable()
        };
      }

      if (self.params.lcAmendmentDetails) {
        self.lcAmendmentDetails = ko.mapping.fromJS(self.params.lcAmendmentDetails);
      }

      if (ko.utils.unwrapObservable(self.lcAmendmentDetails)) {
        shipment();
      }

      if (self.params.confirmationInstructionBankCode && self.params.confirmationInstructionBankCode()) {
        self.partyDetailsloaded(false);

        ReviewAmendLcModel.getBankDetailsBIC(self.params.confirmationInstructionBankCode()).done(function (data) {
          ReviewAmendLcModel.fetchBeniCountry().done(function (countryData) {
            countryList = countryData.enumRepresentations[0].data;
            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
            self.lcAmendmentDetails.requestedConfirmationPartyDetails = ko.mapping.fromJS(data);
            delete self.lcAmendmentDetails.requestedConfirmationPartyDetails.status;
            self.partyDetailsloaded(true);
          });

        });
      }

    }

    setParameters();

    self.applicantAddress = {
      line1: ko.observable(),
      line2: ko.observable(),
      line3: ko.observable(),
      country: ko.observable()
    };

    self.beneName = ko.observable();

    self.beneAddress = {
      line1: ko.observable(),
      line2: ko.observable(),
      line3: ko.observable(),
      country: ko.observable()
    };

    self.reviewDataLoaded = ko.observable(false);

    if (self.confirmationInstructionOptions && self.requestedConfirmationPartyOptions) {
      self.confirmationInstructionDes(params.baseModel.getDescriptionFromCode(self.confirmationInstructionOptions(), ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmationInstruction), "value", "label"));
      self.requestedConfirmationPartyDes(params.baseModel.getDescriptionFromCode(self.requestedConfirmationPartyOptions(), ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationParty), "value", "label"));
    } else {
      ReviewAmendLcModel.fetchConfirmationInstruction().done(function (data) {
        self.confirmationInstructionOptions = ko.observableArray([]);

        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.confirmationInstructionOptions.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }

        self.confirmationInstructionDes(params.baseModel.getDescriptionFromCode(self.confirmationInstructionOptions(), ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmationInstruction), "value", "label"));

        ReviewAmendLcModel.fetchConfirmationParty().done(function (data) {
          self.requestedConfirmationPartyOptions = ko.observableArray([]);

          for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.requestedConfirmationPartyOptions.push({
              value: data.enumRepresentations[0].data[i].code,
              label: data.enumRepresentations[0].data[i].description
            });
          }

          self.requestedConfirmationPartyDes(params.baseModel.getDescriptionFromCode(self.requestedConfirmationPartyOptions(), ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationParty), "value", "label"));
        });
      });
    }

    if (self.creditAvailableWithSelected() === "SWIFTCODE") {
      self.lcAmendmentDetails.validBICCode(true);
    }
    else {
      self.lcAmendmentDetails.validBICCode(false);
    }

    self.amendStages = [{
      stageName: self.resourceBundle.heading.general,
      templateName: ko.observable("trade-finance/amend-lc-details")
    },
    {
      stageName: self.resourceBundle.heading.shipment,
      templateName: ko.observable("trade-finance/amend-shipment-details")
    },
    {
      stageName: self.resourceBundle.heading.documents,
      templateName: ko.observable("trade-finance/amend-document-details")
    },
    {
      stageName: self.resourceBundle.heading.instructions,
      templateName: ko.observable("trade-finance/amend-instructions-details")
    }
    ];

    /**/
    function capitalize(string) {
      if (string) {
        string = string.concat("ed");

        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }
    }

    self.docTblColumns = null;

    if (params.baseModel.large()) {
      self.docTblColumns = [{
        headerText: self.resourceBundle.documents.labels.docName
      },
      {
        headerText: self.resourceBundle.documents.labels.original
      },
      {
        headerText: self.resourceBundle.documents.labels.copies
      }
      ];
    } else {
      self.docTblColumns = [{
        headerText: self.resourceBundle.documents.labels.docName
      },
      {
        headerText: self.resourceBundle.documents.labels.original
      },
      {
        headerText: self.resourceBundle.documents.labels.copies
      },
      {
        headerText: self.resourceBundle.documents.labels.clause
      }
      ];
    }

    self.getLCDetails = function () {
      if (self.letterOfCreditDetails.lcType === "Import") {
        self.beneName(self.letterOfCreditDetails.counterPartyName);
      } else {
        self.applicantName(self.letterOfCreditDetails.counterPartyName);
      }

      if (self.letterOfCreditDetails.counterPartyAddress) {
        if (self.letterOfCreditDetails.lcType === "Import") {
          self.beneAddress.line1(self.letterOfCreditDetails.counterPartyAddress.line1);
          self.beneAddress.line2(self.letterOfCreditDetails.counterPartyAddress.line2);
          self.beneAddress.line3(self.letterOfCreditDetails.counterPartyAddress.line3);
          self.beneAddress.country(getCountryNameFromCode(self.letterOfCreditDetails.counterPartyAddress.country));
        } else {
          self.applicantAddress.line1(self.letterOfCreditDetails.counterPartyAddress.line1);
          self.applicantAddress.line2(self.letterOfCreditDetails.counterPartyAddress.line2);
          self.applicantAddress.line3(self.letterOfCreditDetails.counterPartyAddress.line3);
          self.applicantAddress.country(getCountryNameFromCode(self.letterOfCreditDetails.counterPartyAddress.country));
        }

        self.prevBeneCountry(getCountryNameFromCode(self.letterOfCreditDetails.counterPartyAddress.country));
      }

      self.dropdownLabels.product(self.letterOfCreditDetails.productName);

      if (self.letterOfCreditDetails.incoterm) {
        self.dropdownLabels.incoterm(self.letterOfCreditDetails.incoterm.description);
      }

      if (self.letterOfCreditDetails.attachedDocuments) {
        self.attachedDocuments(self.letterOfCreditDetails.attachedDocuments);
      }

      ReviewAmendLcModel.fetchPartyDetails(self.letterOfCreditDetails.partyId.value).done(function (data) {
        if (self.letterOfCreditDetails.lcType === "Import") {
          self.applicantName(data.party.personalDetails.fullName);

          for (i = 0; i < data.party.addresses.length; i++) {
            if (data.party.addresses[i].type === "PST") {
              self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
              self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
              self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);
              self.applicantAddress.country(getCountryNameFromCode(data.party.addresses[i].postalAddress.country));
            }
          }
        } else {
          self.beneName(data.party.personalDetails.fullName);

          for (i = 0; i < data.party.addresses.length; i++) {
            if (data.party.addresses[i].type === "PST") {
              self.beneAddress.line1(data.party.addresses[i].postalAddress.line1);
              self.beneAddress.line2(data.party.addresses[i].postalAddress.line2);
              self.beneAddress.line3(data.party.addresses[i].postalAddress.line3);
              self.beneAddress.country(getCountryNameFromCode(data.party.addresses[i].postalAddress.country));
            }
          }
        }
      });

      if (self.letterOfCreditDetails.documentPresentationDays && self.letterOfCreditDetails.documentPresentationDays !== null) {
        self.documentPresentationDays(self.letterOfCreditDetails.documentPresentationDays);
      }

      if (self.letterOfCreditDetails.incoterm) {
        const qQuery = { criteria: [] };

        qQuery.criteria.push({
          operand: "code",
          operator: "EQUALS",
          value: [self.letterOfCreditDetails.incoterm.code]
        });

        ReviewAmendLcModel.fetchIncoterm(JSON.stringify(qQuery)).done(function (data) {
          self.dropdownLabels.incoterm(data.incotermList[0].description);
        });
      }

      if (self.lcAmendmentDetails.multiGoodsSupported && ko.isObservable(self.lcAmendmentDetails.multiGoodsSupported) && self.lcAmendmentDetails.multiGoodsSupported() === "Y") {
        self.multiGoodsSupported(true);

        if (self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0) {
          self.datasourceForAmendedGoods = new oj.ArrayTableDataSource(ko.mapping.fromJS(self.letterOfCreditDetails.goods));
        } else {
          self.datasourceForAmendedGoods = new oj.ArrayTableDataSource([]);
        }
      }

      ReviewAmendLcModel.fetchBranch().done(function (data) {
        const beneBranch = data.branchAddressDTO.filter(function (data) {
          return data.id === self.letterOfCreditDetails.branchId;
        });

        self.dropdownLabels.branch(beneBranch[0].branchName);
      });

      if (self.creditAvailableWithSelected() === "SWIFTCODE") {
        ReviewAmendLcModel.getBankDetailsBIC(self.lcAmendmentDetails.availableWith()).done(function (data) {
          data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
          self.availableWithDetails(data);
        });
      }

      if (self.letterOfCreditDetails.issuingBankCode && self.letterOfCreditDetails.issuingBankCode !== null) {
        ReviewAmendLcModel.getBankDetailsBIC(self.letterOfCreditDetails.issuingBankCode).done(function (data) {
          data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);

          if (self.letterOfCreditDetails.lcType === "Import") {
            self.additionalBankDetails(data);
          } else {
            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
            self.additionalIssueBankDetails(data);
          }
        });
      }

      if (self.lcAmendmentDetails.billingDrafts && ko.utils.unwrapObservable(self.lcAmendmentDetails.billingDrafts).length > 0) {
        self.datasourceForDraftReview = new oj.ArrayTableDataSource(self.lcAmendmentDetails.billingDrafts);
        self.billingDraftsLoaded(true);
      }

      self.checkIfLcDetailsLoaded(true);
    };

    self.showPreviousValue = function (previousValue, popUpHolderId) {
      const popup = document.querySelector("#lc-amendment-popup");

      self.previousValue(params.baseModel.format(self.resourceBundle.labels.prevValueLabel, { prevValueLabel: previousValue }));

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#" + popUpHolderId);
      }
    };

    self.showPreviousValueForTable = function (previousValue, popUpHolderId, popupId) {
      const popup = document.querySelector("#" + popupId);

      if (previousValue) {
        self.previousValue(params.baseModel.format(self.resourceBundle.labels.prevValueLabel, { prevValueLabel: previousValue }));
      }
      else {
        self.previousValue(null);
      }

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#" + popUpHolderId);
      }
    };

    self.showPreviousExpiryDate = function () {
      const popup = document.querySelector("#popup-expiryDate");

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#prev-expiryDate");
      }

    };

    self.showPreviousGuaranteeAmendAmount = function () {
      const popup = document.querySelector("#popup-GuaranteeAmount");

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#prev-guaranteeAmount");
      }

    };

    self.showPreviousToleranceUnder = function () {
      const popup = document.querySelector("#popup-ToleranceUnder");

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#prev-toleranceUnder");
      }

    };

    self.showPreviousToleranceAbove = function () {
      const popup = document.querySelector("#popup-ToleranceAbove");

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#prev-toleranceAbove");
      }

    };

    self.showPreviousLoadingPort = function () {
      const popup = document.querySelector("#popup-LoadingPort");

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#prev-loadingPort");
      }

    };

    function createDataForReview() {
      self.beneName(self.params.lcAmendmentDetails.counterPartyName);
      self.beneAddress.line1(self.params.lcAmendmentDetails.counterPartyAddress.line1);
      self.beneAddress.line2(self.params.lcAmendmentDetails.counterPartyAddress.line2);
      self.beneAddress.country(getCountryNameFromCode(self.params.lcAmendmentDetails.counterPartyAddress.country));

      if (self.creditAvailableWithSelected() === "SWIFTCODE") {
        if (self.lcAmendmentDetails.availableWith && self.lcAmendmentDetails.availableWith()) {
          ReviewAmendLcModel.getBankDetailsBIC(self.lcAmendmentDetails.availableWith()).done(function (data) {
            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
            self.availableWithDetails(data);
          });

        }
      }

      if (self.params.creditAvailableWithSelected === "SWIFTCODE") {
        self.lcAmendmentDetails.paymentDetails(null);
      }

      ReviewAmendLcModel.fetchPartyDetails(self.params.letterOfCreditDetails.partyId.value).done(function (data) {
        for (i = 0; i < data.party.addresses.length; i++) {
          if (data.party.addresses[i].type === "PST") {
            self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
            self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
            self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);
            self.applicantAddress.country(getCountryNameFromCode(data.party.addresses[i].postalAddress.country));
          }
        }
      });

      if (self.params.draftArray) {
        self.billingDraftsLoaded(false);
        self.draftArray(ko.utils.unwrapObservable(self.params.draftArray));

        self.billingDraftsLoaded(true);
      }

      if (self.params.draftArrayOriginal) {
        self.billingDraftsLoaded(false);
        self.draftArrayOriginal(ko.utils.unwrapObservable(self.params.draftArrayOriginal));
        self.billingDraftsLoaded(true);
      }

      if (self.params.goodsArrayOriginal) {
        self.goodsArrayOriginal = ko.observableArray(ko.utils.unwrapObservable(self.params.goodsArrayOriginal));

        self.datasourceForGoodsReviewOriginal = new oj.ArrayTableDataSource(self.goodsArrayOriginal, {
          idAttribute: "code"
        });
      }

      if (self.params.documentDetailsOriginal) {
        self.showDocuments(false);
        self.documentDetailsOriginal(ko.utils.unwrapObservable(self.params.documentDetailsOriginal));
        self.showDocuments(true);

        if (self.lcAmendmentDetails.document) {
          const documents = ko.mapping.toJS(self.lcAmendmentDetails.document);

          if (JSON.stringify(self.params.documentDetailsOriginal) !== JSON.stringify(documents)) {
            self.isDocumentTableChanged(true);
          }
        }
      }

      self.billingDraftsLoaded(self.params.billingDraftsLoaded);

      self.goodsArray(ko.utils.unwrapObservable(self.lcAmendmentDetails.goods));
    }

    /*This Component called with following modes
    ACCEPTANCE : From Customer Acceptance Export amendment
    VIEW : From importLC View Amendments
    REVIEW : From importLC Initiate amendment
    approval : From Approval Flow of Amendment Initiation and Export amendment
    */
    if (self.mode() === "approval" || self.mode() === "ACCEPTANCE" || self.mode() === "VIEW") {
      if (self.mode() === "ACCEPTANCE") {
        params.dashboard.headerName(self.resourceBundle.heading.customerAcceptance);
        self.showDocuments(true);
      } else if (self.mode() === "VIEW") {
        if (self.letterOfCreditDetails && self.letterOfCreditDetails.lcType) {
          if (self.letterOfCreditDetails.lcType === "Export") {
            params.dashboard.headerName(self.resourceBundle.heading.exportLCAmendment);
          } else {
            params.dashboard.headerName(self.resourceBundle.heading.importLCAmendment);
          }
        } else {
          params.dashboard.headerName(self.resourceBundle.heading.importLCAmendment);
        }
      }

      self.checkIfLcDetailsLoaded = ko.observable(false);
      self.isExpiryDateChanged = ko.observable(false);
      self.shipmentDatePeriodRadioSetValue = ko.observable();
      self.isShipmentDateChanged = ko.observable(false);

      if (self.mode() === "ACCEPTANCE") {
        const getNewKoModel = function () {
          const KoModel = ReviewAmendLcModel.getNewModel();

          return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());
        self.exportAmendAcceptanceDetails = self.rootModelInstance().ExportAmendAcceptanceDetails;
      }

      if (self.mode() === "approval" && self.params.data.customerAcceptanceStatus) {
        ReviewAmendLcModel.getAmendmentDetails(ko.utils.unwrapObservable(self.params.data.lcId), ko.utils.unwrapObservable(self.params.data.id)).done(function (data) {
          self.lcAmendmentDetails = ko.mapping.fromJS(data.letterOfCreditAmendment);

          if (self.lcAmendmentDetails.goods) {

            if (self.lcAmendmentDetails.goods().length > 0) {
              self.multiGoodsSupported(true);
              self.goodsArray(ko.utils.unwrapObservable(self.lcAmendmentDetails.goods));
            }
          }

          ReviewAmendLcModel.getImportLC(ko.utils.unwrapObservable(self.params.data.lcId), ko.utils.unwrapObservable(self.lcAmendmentDetails.versionNo)).done(function (data) {
            self.letterOfCreditDetails = data.letterOfCredit;

            self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNoWithAmendNoStatus, {
              lcNumber: self.letterOfCreditDetails.id,
              amendmentNumber: self.params.data.id,
              status: capitalize(self.params.data.customerAcceptanceStatus)
            }));

            ReviewAmendLcModel.fetchBeniCountry().done(function (data) {
              countryList = data.enumRepresentations[0].data;
              self.getLCDetails();
            });

            self.showDocuments(false);
            self.documentDetailsOriginal(ko.utils.unwrapObservable(self.letterOfCreditDetails.document));
            self.showDocuments(true);
            self.reviewDataLoaded(true);
          });
        });
      } else {

        if (ko.utils.unwrapObservable(self.lcAmendmentDetails)) {
          self.lcAmendmentDetails = ko.utils.unwrapObservable(self.lcAmendmentDetails);
        }
        else {
          self.lcAmendmentDetails = ko.mapping.fromJS(self.params.data);
        }

        if (self.lcAmendmentDetails.goods) {
          self.multiGoodsSupported(true);

          if (self.lcAmendmentDetails.goods().length > 0) {
            self.goodsArray(ko.utils.unwrapObservable(self.lcAmendmentDetails.goods));
          }
        }

        ReviewAmendLcModel.getImportLC(ko.utils.unwrapObservable(self.lcAmendmentDetails.lcId), ko.utils.unwrapObservable(self.lcAmendmentDetails.versionNo)).done(function (data) {
          self.letterOfCreditDetails = data.letterOfCredit;

          if (self.mode() === "VIEW" || self.mode() === "ACCEPTANCE") {

            if (self.lcAmendmentDetails.id) {
              self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNoWithAmendNo, {
                lcNumber: self.letterOfCreditDetails.id,
                amendmentNumber: self.lcAmendmentDetails.id()
              }));

            } else {
              self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNumber, {
                lcNumber: self.letterOfCreditDetails.id
              }));
            }

            self.requestedConfirmationPartyLoaded = ko.observable(false);
            self.confirmationInstructionBankCode = ko.observable();
            self.requestedConfirmationPartyDetails = ko.observable();

            if (ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationParty)) {
              self.requestedConfirmationPartyLoaded(true);

              if (ko.utils.unwrapObservable(self.lcAmendmentDetails.advisingThroughBankCode) || ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmingBankCode)) {
                self.confirmationInstructionBankCode(self.lcAmendmentDetails.advisingThroughBankCode ? ko.utils.unwrapObservable(self.lcAmendmentDetails.advisingThroughBankCode) : ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmingBankCode));
                self.requestedConfirmationPartyMode = "SWIFTCODE";

                ReviewAmendLcModel.getBankDetailsBIC(self.confirmationInstructionBankCode()).done(function (data) {
                  self.requestedConfirmationPartyDetails(data);
                });
              } else if (ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationParty) !== "ABK") {
                self.requestedConfirmationPartyMode = "BANKADDRESS";
                self.requestedConfirmationPartyDetails(self.lcAmendmentDetails.requestedConfirmationPartyDetails);
              }
            }

            if (self.params.goodsArrayOriginal || self.letterOfCreditDetails.goods) {
              self.goodsArrayOriginal = self.params.goodsArrayOriginal ? ko.observableArray(ko.utils.unwrapObservable(self.params.goodsArrayOriginal)) : self.letterOfCreditDetails.goods;

              self.datasourceForGoodsReviewOriginal = new oj.ArrayTableDataSource(self.goodsArrayOriginal, {
                idAttribute: "code"
              });

              if ((self.lcAmendmentDetails.goods && (JSON.stringify(ko.utils.unwrapObservable(self.goodsArrayOriginal)) !== JSON.stringify(self.lcAmendmentDetails.goods()))) || !self.lcAmendmentDetails.goods) {
                self.isGoodsTableChanged(true);
              }
            }

            self.multiGoodsSupported(self.letterOfCreditDetails.multiGoodsSupported === "Y");

            if (!self.datasourceForGoodsReview) {

              self.goodsArray(ko.utils.unwrapObservable(self.lcAmendmentDetails.goods ? self.lcAmendmentDetails.goods : []));
            }

            if (!self.datasourceForDocReview) {
              self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.lcAmendmentDetails.document, {
                idAttribute: "id"
              }));
            }

            if (self.lcAmendmentDetails.document && self.letterOfCreditDetails.document) {
              if (JSON.stringify(self.letterOfCreditDetails.document) !== JSON.stringify(self.lcAmendmentDetails.document())) {
                self.isDocumentTableChanged(true);
              }
            }

            self.showDocuments(false);
            self.documentDetailsOriginal(ko.utils.unwrapObservable(self.letterOfCreditDetails.document));
            self.showDocuments(true);

            if (self.lcAmendmentDetails.billingDrafts) {
              if (JSON.stringify(self.letterOfCreditDetails.billingDrafts) !== JSON.stringify(self.lcAmendmentDetails.billingDrafts())) {
                self.hasDraftTableChanged(true);
              }
            }

          } else {
            self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNumber, {
              lcNumber: self.letterOfCreditDetails.id
            }));

            self.requestedConfirmationPartyLoaded = ko.observable(false);
            self.confirmationInstructionBankCode = ko.observable();
            self.requestedConfirmationPartyDetails = ko.observable();

            if (ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationParty)) {
              self.requestedConfirmationPartyLoaded(true);

              if (ko.utils.unwrapObservable(self.lcAmendmentDetails.advisingThroughBankCode) || ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmingBankCode)) {
                self.confirmationInstructionBankCode(self.lcAmendmentDetails.advisingThroughBankCode ? ko.utils.unwrapObservable(self.lcAmendmentDetails.advisingThroughBankCode) : ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmingBankCode));
                self.requestedConfirmationPartyMode = "SWIFTCODE";

                ReviewAmendLcModel.getBankDetailsBIC(self.confirmationInstructionBankCode()).done(function (data) {
                  self.requestedConfirmationPartyDetails(data);
                });
              } else if (ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationParty) !== "ABK") {
                self.requestedConfirmationPartyMode = "BANKADDRESS";
                self.requestedConfirmationPartyDetails(self.lcAmendmentDetails.requestedConfirmationPartyDetails);
              }
            }
          }

          ReviewAmendLcModel.fetchBeniCountry().done(function (data) {
            countryList = data.enumRepresentations[0].data;
            self.getLCDetails();
          });

          self.reviewDataLoaded(true);
        });
      }
    } else {
      if (self.mode() === "REVIEW") {
        ReviewAmendLcModel.fetchBeniCountry().done(function (data) {
          countryList = data.enumRepresentations[0].data;
          createDataForReview();
        });

      }

      self.reviewDataLoaded = ko.observable(true);
    }

    self.letterOfCreditDetails = self.params.letterOfCreditDetails;

    if (self.mode() === "REVIEW") {
      if (self.letterOfCreditDetails.lcType === "Export") {
        params.dashboard.headerName(self.resourceBundle.heading.initiateExportLCAmendment);
      } else {
        params.dashboard.headerName(self.resourceBundle.heading.initiateLCAmendment);
      }
    }

    self.exposureAmount = ko.computed(function () {
      if (self.reviewDataLoaded()) {
        if (self.lcAmendmentDetails.newAmount.amount === null) {
          return 0;
        }

        return parseFloat(ko.utils.unwrapObservable(self.lcAmendmentDetails.newAmount.amount) * 0.01 * ko.utils.unwrapObservable(self.lcAmendmentDetails.toleranceAbove)) + parseFloat(ko.utils.unwrapObservable(self.lcAmendmentDetails.newAmount.amount));
      }
    });

    self.isExpiryDateChanged = ko.computed(function () {
      if (self.reviewDataLoaded()) {
        if (self.letterOfCreditDetails && self.lcAmendmentDetails.newExpiryDate !== null) {
          const prevExpiryDate = new Date(self.letterOfCreditDetails.expiryDate),
            newExpiryDate = new Date(ko.utils.unwrapObservable(self.lcAmendmentDetails.newExpiryDate));

          newExpiryDate.setHours(0, 0, 0, 0);

          return prevExpiryDate.toISOString() !== newExpiryDate.toISOString();
        }
      }
    });

    self.isShipmentDateChanged = ko.computed(function () {
      if (self.reviewDataLoaded()) {
        if (self.letterOfCreditDetails && ko.utils.unwrapObservable(self.lcAmendmentDetails.shipmentDetails.date) && self.letterOfCreditDetails.shipmentDetails.date) {
          const prevShipmentDate = new Date(self.letterOfCreditDetails.shipmentDetails.date),
            newShipmentDate = new Date(self.lcAmendmentDetails.shipmentDetails.date());

          newShipmentDate.setHours(0, 0, 0, 0);

          return prevShipmentDate.toISOString() !== newShipmentDate.toISOString();
        }
      }
    });

    self.goBack = function () {
      self.isBackFromReview(true);
      params.rootModel.params.lcAmendmentDetails.draftsRequired = params.rootModel.params.lcAmendmentDetails.draftsRequired ? ko.observable("true") : ko.observable("false");

      const parameters = {
        mode: "EDIT",
        isBackFromReview: self.isBackFromReview,
        letterOfCreditDetails: params.rootModel.params.letterOfCreditDetails,
        lcAmendmentDetails: params.rootModel.params.lcAmendmentDetails,
        applicantName: self.applicantName(),
        applicantAddress: self.applicantAddress,
        multiGoodsSupported: self.multiGoodsSupported,
        goodsArrayOriginal: self.goodsArrayOriginal,
        goodsArray: self.goodsArray,
        draftArray: self.draftArray ? self.draftArray : null,
        docArray: self.params.docArray ? self.params.docArray : null,
        draftArrayOriginal: self.draftArrayOriginal,
        creditAvailableWithSelected: self.creditAvailableWithSelected(),
        billingDraftsLoaded: self.billingDraftsLoaded,
        draweeBank: self.params.draweeBank ? self.params.draweeBank : null,
        availableWithDetails: self.availableWithDetails,
        additionalBankDetails: self.additionalBankDetails,
        transferableTypevalueOptions: self.params.transferableTypevalueOptions ? self.params.transferableTypevalueOptions : ko.observableArray([]),

        bankDetailsLoaded: self.params.bankDetailsLoaded ? self.params.bankDetailsLoaded : ko.observable(true),
        requestedConfirmationPartyMode: self.params.requestedConfirmationPartyMode
      };

      params.dashboard.loadComponent("amend-letter-of-credit", parameters);
    };

    self.confirmAmendment = function () {
      if (ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmationInstruction) === "WITHOUT") {
        self.lcAmendmentDetails.requestedConfirmationPartyDetails = null;
      } else if ((self.requestedConfirmationPartyDetails() && self.requestedConfirmationPartyDetails().code) || (self.lcAmendmentDetails.requestedConfirmationParty() === "ABK")) {
        self.lcAmendmentDetails.requestedConfirmationPartyDetails = null;

        if (self.lcAmendmentDetails.requestedConfirmationParty() === "ATB") {
          self.lcAmendmentDetails.advisingThroughBankCode(self.requestedConfirmationPartyDetails().code);
        }
        else if (self.lcAmendmentDetails.requestedConfirmationParty() === "COB") {
          self.lcAmendmentDetails.confirmingBankCode(self.requestedConfirmationPartyDetails().code);
        }
      }

      if (self.creditAvailableWithSelected() === "SWIFTCODE") {
        self.lcAmendmentDetails.validBICCode(true);
      }
      else {
        self.lcAmendmentDetails.validBICCode(false);
      }

      self.lcAmendmentDetails.versionNo = self.letterOfCreditDetails.versionNo;
      self.lcAmendmentDetails.draftsRequired(self.lcAmendmentDetails.draftsRequired ? JSON.parse(self.lcAmendmentDetails.draftsRequired()) : null);

      if (self.lcAmendmentDetails.draftsRequired()) {
        self.lcAmendmentDetails.billingDrafts = ko.observableArray([]);

        for (let i = 0; i < self.draftArray().length; i++) {
          self.lcAmendmentDetails.billingDrafts.push({
            tenor: self.draftArray()[i].tenor,
            amount: self.draftArray()[i].amount,
            otherInformation: self.draftArray()[i].otherInformation,
            draweeBankId: self.draftArray()[i].draweeBankId
          });
        }
      }

      let payload;

      if (self.creditAvailableWithSelected() === "SWIFTCODE") {
        payload = ko.mapping.toJSON(self.lcAmendmentDetails, {
          ignore: ["draftsRequired"],
          include: ["billingDrafts"]
        });
      }
      else {
        payload = ko.mapping.toJSON(self.lcAmendmentDetails, {
          ignore: ["draftsRequired"],
          include: ["billingDrafts"]
        });
      }

      ReviewAmendLcModel.initiateAmendment(self.letterOfCreditDetails.id, payload).done(function (data, status, jqXhr) {
        const confirmScreenDetailsArray = [
          [{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.lcDetails.labels.beneficiaryName,
            value: self.beneName()
          }
          ],
          [{
            label: self.resourceBundle.lcDetails.labels.product,
            value: self.dropdownLabels.product()
          },
          {
            label: self.resourceBundle.lcDetails.labels.dateofExpiry,
            value: self.lcAmendmentDetails.newExpiryDate
          }
          ]
        ];

        if (self.letterOfCreditDetails.advisingBankCode && self.letterOfCreditDetails.advisingBankCode !== null && self.letterOfCreditDetails.advisingBankCode !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.common.labels.amount,
            value: params.baseModel.formatCurrency(self.letterOfCreditDetails.amount.amount, self.letterOfCreditDetails.amount.currency)
          },
          {
            label: self.resourceBundle.instructionsDetails.labels.advBankSwiftCode,
            value: self.letterOfCreditDetails.advisingBankCode
          }
          ]);
        } else {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.common.labels.amount,
            value: params.baseModel.formatCurrency(self.letterOfCreditDetails.amount.amount, self.letterOfCreditDetails.amount.currency)
          }]);
        }

        let hostReferenceNumber = null;

        if (data.letterOfCredit && data.letterOfCreditAmendment.applicationNumber) {
          hostReferenceNumber = data.letterOfCreditAmendment.applicationNumber;
        }
        else if (data.letterOfCreditAmendment && data.letterOfCreditAmendment.id) {
          hostReferenceNumber = data.letterOfCreditAmendment.id;
        } else {
          hostReferenceNumber = null;
        }

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          hostReferenceNumber: hostReferenceNumber,
          transactionName: self.resourceBundle.heading.initiateLCAmendment,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_N_ALC",
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };

    self.initiateAcceptance = function () {
      self.exportAmendAcceptanceDetails.customerAcceptanceStatus("ACCEPT");
      self.exportAmendAcceptanceDetails.counterPartyName(self.letterOfCreditDetails.counterPartyName);
      self.exportAmendAcceptanceDetails.newAmount.amount(self.lcAmendmentDetails.newAmount.amount());
      self.exportAmendAcceptanceDetails.newAmount.currency(self.lcAmendmentDetails.newAmount.currency());

      ReviewAmendLcModel.exportAmendAcceptance(self.lcAmendmentDetails.lcId(), self.lcAmendmentDetails.id(), ko.mapping.toJSON(self.exportAmendAcceptanceDetails)).done(function (data, status, jqXhr) {
        const confirmScreenDetailsArray = [
          [{
            label: self.resourceBundle.labels.lcNo,
            value: self.lcAmendmentDetails.lcId()
          },
          {
            label: self.resourceBundle.common.labels.amount,
            value: params.baseModel.formatCurrency(self.lcAmendmentDetails.newAmount.amount(), self.lcAmendmentDetails.newAmount.currency())
          }
          ]
        ];

        if (self.letterOfCreditDetails.remarks && self.lcAmendmentDetails.narrative && self.letterOfCreditDetails.remarks !== null && self.letterOfCreditDetails.remarks !== "" && self.lcAmendmentDetails.narrative !== null && self.lcAmendmentDetails.narrative !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.instructionsDetails.labels.remarks,
            value: self.letterOfCreditDetails.remarks
          }
          ], [{
            label: self.resourceBundle.lcDetails.amendments.narrative,
            value: self.lcAmendmentDetails.narrative
          }]);
        } else if (self.letterOfCreditDetails.remarks && self.letterOfCreditDetails.remarks !== null && self.letterOfCreditDetails.remarks !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.instructionsDetails.labels.remarks,
            value: self.letterOfCreditDetails.remarks
          }
          ]);
        } else if (self.lcAmendmentDetails.narrative && self.lcAmendmentDetails.narrative !== null && self.lcAmendmentDetails.narrative !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.instructionsDetails.labels.remarks,
            value: self.lcAmendmentDetails.narrative
          }
          ]);
        } else {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          }]);
        }

        let hostReferenceNumber = null;

        if (data.customerAcceptance && data.customerAcceptance.applicationNumber) {
          hostReferenceNumber = data.customerAcceptance.applicationNumber;
        }
        else if (data.customerAcceptance && data.customerAcceptance.id) {
          hostReferenceNumber = data.customerAcceptance.id;
        } else {
          hostReferenceNumber = null;
        }

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          hostReferenceNumber: hostReferenceNumber,
          transactionName: self.resourceBundle.heading.customerAcceptance,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_N_ALC",
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };

    self.rejectAcceptance = function () {
      self.exportAmendAcceptanceDetails.customerAcceptanceStatus("REJECT");
      self.exportAmendAcceptanceDetails.counterPartyName(self.letterOfCreditDetails.counterPartyName);
      self.exportAmendAcceptanceDetails.newAmount.amount(self.lcAmendmentDetails.newAmount.amount());
      self.exportAmendAcceptanceDetails.newAmount.currency(self.lcAmendmentDetails.newAmount.currency());

      ReviewAmendLcModel.exportAmendAcceptance(self.lcAmendmentDetails.lcId(), self.lcAmendmentDetails.id(), ko.mapping.toJSON(self.exportAmendAcceptanceDetails)).done(function (data, status, jqXhr) {
        const confirmScreenDetailsArray = [
          [{
            label: self.resourceBundle.labels.lcNo,
            value: self.lcAmendmentDetails.lcId()
          },
          {
            label: self.resourceBundle.common.labels.amount,
            value: params.baseModel.formatCurrency(self.lcAmendmentDetails.newAmount.amount(), self.lcAmendmentDetails.newAmount.currency())
          }
          ]
        ];

        if (self.letterOfCreditDetails.remarks && self.lcAmendmentDetails.narrative && self.letterOfCreditDetails.remarks !== null && self.letterOfCreditDetails.remarks !== "" && self.lcAmendmentDetails.narrative !== null && self.lcAmendmentDetails.narrative !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.instructionsDetails.labels.remarks,
            value: self.letterOfCreditDetails.remarks
          }
          ], [{
            label: self.resourceBundle.lcDetails.amendments.narrative,
            value: self.lcAmendmentDetails.narrative
          }]);
        } else if (self.lcAmendmentDetails.narrative && self.lcAmendmentDetails.narrative !== null && self.lcAmendmentDetails.narrative !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.instructionsDetails.labels.remarks,
            value: self.lcAmendmentDetails.narrative
          }
          ]);
        } else if (self.letterOfCreditDetails.remarks && self.letterOfCreditDetails.remarks !== null && self.letterOfCreditDetails.remarks !== "") {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          },
          {
            label: self.resourceBundle.instructionsDetails.labels.remarks,
            value: self.letterOfCreditDetails.remarks
          }
          ]);
        } else {
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.lcDetails.labels.applicantName,
            value: self.applicantName()
          }]);
        }

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.resourceBundle.heading.customerAcceptance,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_N_ALC",
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };

    self.viewClauses = function (selectedDoc) {
      let clauses = selectedDoc.clause;

      if (clauses === undefined) {
        clauses = [];
      }

      self.selectedClauses({
        docId: selectedDoc.id,
        docName: params.baseModel.format(self.resourceBundle.labels.documentName, {
          docName: selectedDoc.name
        }),
        datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(clauses))
      });

      self.clauseModalHeading(params.baseModel.format(self.resourceBundle.labels.documentName, {
        docName: selectedDoc.name
      }));

      $("#documentClauses").trigger("openModal");
    };

    self.goBack = function () {
      if (self.setMenuAsAmendment) {
        self.setMenuAsAmendment(true);
      }

      if (self.mode() === "VIEW" && self.flow !== "TRACKER") {
        const parameters = {
          mode: "VIEW",
          setMenuAsAmendment: self.setMenuAsAmendment,
          letterOfCreditDetails: self.letterOfCreditDetails
        };

        params.dashboard.loadComponent("view-letter-of-credit", parameters);
      }
      else {
        history.back();
      }
    };

    self.getRowId = function (rowIndex) {
      return ++rowIndex;
    };

    self.getDocumentDetails = function () {
      if (self.lcAmendmentDetails.document && self.lcAmendmentDetails.document() && self.lcAmendmentDetails.document().length > 0) {
        self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.lcAmendmentDetails.document, {
          idAttribute: "id"
        }));

        for (i = 0; i < self.lcAmendmentDetails.document().length; i++) {
          if (self.lcAmendmentDetails.document()[i].clause && self.lcAmendmentDetails.document()[i].clause().length > 0) {
            self.clauseTableArrayForReview.push({
              docName: params.baseModel.format(self.resourceBundle.labels.documentName, {
                docName: self.lcAmendmentDetails.document()[i].name
              }),
              datasourceForClauseReview: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.lcAmendmentDetails.document()[i].clause))
            });
          }
        }

        self.documentsLoaded(true);
      }
    };

    self.getDocumentDetails();
  };

  vm.prototype.dispose = function () {
    self.exposureAmount.dispose();
    self.isExpiryDateChanged.dispose();
    self.isShipmentDateChanged.dispose();
  };

  return vm;
});
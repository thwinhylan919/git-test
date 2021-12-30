define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/view-letter-of-credit",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojnavigationlist",
  "ojs/ojdatetimepicker",
  "ojs/ojconveyorbelt",
  "ojs/ojradioset",
  "ojs/ojswitch",
  "ojs/ojpagingcontrol",
  "ojs/ojcheckboxset"
], function (oj, ko, $, AmendLetterOfCreditModel, resourceBundle) {
  "use strict";

  let self;
  const vm = function (params) {
    self = this;

    let i, j, totalGoodsAmount = 0;

    self.incotermTypeOptions = ko.observable();

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.mode = ko.observable(self.params.mode);
    self.amendLC = true;
    self.sectionHeading = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.reviewDataLoaded = ko.observable(false);
    self.checkIfLcDetailsLoaded = ko.observable(false);
    self.isExpiryDateChanged = ko.observable(false);
    self.isShipmentDateChanged = ko.observable(false);
    self.shipmentDatePeriodRadioSetValue = ko.observable();
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("review-amend-lc", "letter-of-credit");
    params.baseModel.registerElement("bank-look-up");
    params.baseModel.registerElement("floating-panel");
    self.benecountryName = ko.observable();
    self.lcDetailsFromViewLC = ko.observable();
    self.setMenuAsAmendment = ko.observable(false);
    /*for validation groups in amend lc*/
    self.amendLcTracker = ko.observable();
    self.disbaledTenor = ko.observable(false);
    self.amendLcGroupValid = ko.observable();
    self.amendShipmentTracker = ko.observable();
    self.amendShipmentGroupValid = ko.observable();
    self.amendInsturctionsTracker = ko.observable();
    self.amendInstructionsGroupValid = ko.observable();
    self.tncTracker = ko.observable();
    self.tncGroupValid = ko.observable();
    self.beneIdOptions = ko.observable();
    self.beneCountryoptions = ko.observableArray();
    self.goodsDescription = ko.observable();
    self.goodsTypeOptions = ko.observable();
    self.incotermValue = ko.observable();
    self.beneVisibility = ko.observable();
    self.benecountry = ko.observable("");
    self.minEffectiveDate = ko.observable();
    self.bicCodeError = ko.observable(false);
    self.selectedClausesLength = ko.observable(0);
    self.clauseTableArrayForReview = ko.observableArray([]);
    self.docArray = ko.observableArray([]);
    self.letterOfCreditDetails = self.params.letterOfCreditDetails;
    self.beneName = self.params.beneName;
    self.beneAddress = self.params.beneAddress;
    self.showDocuments = ko.observable(true);
    self.additionalBankDetails = ko.observable(ko.utils.unwrapObservable(self.params.additionalBankDetails));
    self.availableWithDetails = ko.observable(ko.utils.unwrapObservable(self.params.availableWithDetails));
    self.creditAvailableWithSelected = ko.observable(ko.utils.unwrapObservable(self.params.creditAvailableWithSelected));
    self.applicantName = ko.observable(self.params.applicantName);
    self.billingDraftsLoaded = ko.observable(ko.utils.unwrapObservable(self.params.billingDraftsLoaded));
    self.applicantAddress = self.params.applicantAddress;
    self.clauseTableArray = ko.observableArray();
    self.multiGoodsSupported = ko.observable(ko.utils.unwrapObservable(self.params.multiGoodsSupported));
    self.partialShipmentOptionsArray = ko.observableArray();
    self.transShipmentOptionsArray = ko.observableArray();
    self.beneId = ko.observable("");
    self.documentsLoaded = ko.observable(false);
    self.additionalIssueBankDetails = ko.observable();
    self.draftArray = ko.observableArray([]);
    self.selectedClauses = ko.observable();

    self.datasourceForDraft = new oj.ArrayTableDataSource(self.draftArray, {
      idAttribute: "id"
    });

    self.goodsArray = self.params.goodsArrayOriginal || ko.observableArray([{
      id: 1,
      code: ko.observable(""),
      description: ko.observable(""),
      noOfUnits: ko.observable(""),
      pricePerUnit: ko.observable("")
    }]);

    self.datasourceForAmendedGoods = new oj.ArrayTableDataSource(self.goodsArray, {
      idAttribute: "id"
    });

    self.confirmationInstructionBankCode = ko.observable();
    self.advisingThroughBankCode = ko.observable();
    self.confirmingBankCode = ko.observable();
    self.confirmationInstructionOptions = ko.observableArray([]);
    self.requestedConfirmationPartyOptions = ko.observableArray([]);
    self.confirmationInstruction = self.confirmationInstruction ? self.confirmationInstruction : ko.observable();
    self.requestedConfirmationParty = ko.observable();
    self.requestedConfirmationPartyDetails = ko.observable();
    self.requestedConfirmationPartyLoaded = ko.observable(true);

    self.lcAmendmentDetails = self.params.lcAmendmentDetails ? ko.mapping.fromJS(self.params.lcAmendmentDetails) : undefined;

    self.transferableTypeValueLoaded = ko.observable(false);

    self.transferableTypeValueChangeHandler = function (event, data) {
      self.lcAmendmentDetails.paymentDetails(null);

      if (event.detail.value === "DEFFEREDPAYMENT" || event.detail.value === "MIXEDPAYMENT") {
        self.transferableTypeValueLoaded(true);
      } else {
        self.transferableTypeValueLoaded(false);
      }
    };

    self.creditAvailableWithSelectedClick = function (newVal) {

      if (newVal.target.value === "BANKADDRESS") {
        self.lcAmendmentDetails.validBICCode(false);
      }
      else {
        self.lcAmendmentDetails.validBICCode(true);
      }

      self.lcAmendmentDetails.availableWith(null);
      self.availableWithDetails(null);

    };

    self.datasourceForDoc = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.docArray, {
      idAttribute: "id"
    }));

    self.draweeBank = ko.observable("");
    self.bankDetailsLoaded = ko.observable(false);

    self.requestedConfirmationPartyMode = self.requestedConfirmationPartyMode ? self.requestedConfirmationPartyMode : ko.observable("SWIFTCODE").extend({
      notify: "always"
    });

    self.openlcLookup = function () {
      self.clearingCodeType("SWI");
      $("#openLookup").trigger("openModal");
    };

    function setPrevStateValues() {

      self.draftArray(ko.utils.unwrapObservable(self.params.draftArray ? self.params.draftArray : []));
      self.docArray(ko.utils.unwrapObservable(self.params.docArray ? self.params.docArray : []));
      self.draweeBank = self.params.draweeBank ? self.params.draweeBank : ko.observable("");
      self.bankDetailsLoaded = self.params.bankDetailsLoaded ? self.params.bankDetailsLoaded : ko.observable(false);
      self.transferableTypevalueOptions = self.params.transferableTypevalueOptions ? self.params.transferableTypevalueOptions : ko.observableArray([]);

      if (self.params.requestedConfirmationPartyMode) {
        self.requestedConfirmationPartyMode = ko.observable(self.params.requestedConfirmationPartyMode);
      }

    }

    setPrevStateValues();

    self.partyDetailsloaded = ko.observable(true);

    self.lookup = ko.observable(false);

    self.clearingCodeType = ko.observable("SWI").extend({
      notify: "always"
    });

    self.networkCode = ko.observable();

    self.dropdownListLoaded = {
      branches: ko.observable(false),
      chargingAccounts: ko.observable(false),
      countries: ko.observable(false),
      goods: ko.observable(false),
      incoterm: ko.observable(false),
      parties: ko.observable(false),
      products: ko.observable(false),
      counterPartyNames: ko.observable(false)
    };

    self.dropdownLabels = self.params.dropdownLabels ? self.params.dropdownLabels : {};
    self.dropdownLabels.country = ko.observable();

    AmendLetterOfCreditModel.fetchCreditAvailaibleByTypes().done(function (taskData) {
      const transferableTypes = taskData.enumRepresentations[0].data.map(function (data) {
        return {
          value: data.code,
          label: data.description
        };
      }).filter(function (data) {
        return data.label && data.value;
      });

      self.transferableTypevalueOptions(transferableTypes);

      self.dataLoaded(false);
      ko.tasks.runEarly();
      self.dataLoaded(true);

    });

    /**/
    self.createModelFromArray = function () {

      self.lcAmendmentDetails.document.removeAll();

      for (i = 0; i < self.docArray().length; i++) {
        const selectedClauses = [];

        if (self.docArray()[i].docSelected()[0] === "true") {
          for (j = 0; j < self.docArray()[i].clause.length; j++) {
            if (self.docArray()[i].clause[j].selected()[0] === "true") {
              selectedClauses.push({
                id: self.docArray()[i].clause[j].id,
                description: self.docArray()[i].clause[j].description(),
                name: self.docArray()[i].clause[j].name
              });
            }
          }

          if (selectedClauses.length > 0) {
            self.lcAmendmentDetails.document.push({
              id: self.docArray()[i].id,
              name: self.docArray()[i].name,
              originals: self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
              copies: self.docArray()[i].copies(),
              clause: selectedClauses,
              docType: self.docArray()[i].docType
            });
          } else {
            self.lcAmendmentDetails.document.push({
              id: self.docArray()[i].id,
              name: self.docArray()[i].name,
              originals: self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
              copies: self.docArray()[i].copies(),
              docType: self.docArray()[i].docType
            });
          }
        }
      }

      self.lcAmendmentDetails.goods.removeAll();

      if (self.multiGoodsSupported() === false) {
        self.lcAmendmentDetails.goods.push({
          code: self.lcAmendmentDetails.shipmentDetails.goodsCode(),
          description: self.lcAmendmentDetails.shipmentDetails.description(),
          noOfUnits: null,
          pricePerUnit: null
        });
      } else {
        for (i = 0; i < self.goodsArray().length; i++) {
          if (self.goodsArray()[i].code() !== "") {
            self.lcAmendmentDetails.goods.push({
              code: self.goodsArray()[i].code(),
              description: self.goodsArray()[i].description(),
              noOfUnits: self.goodsArray()[i].noOfUnits() !== "" ? self.goodsArray()[i].noOfUnits() : null,
              pricePerUnit: self.goodsArray()[i].pricePerUnit() !== "" ? self.goodsArray()[i].pricePerUnit() : null
            });
          }
        }
      }
    };

    self.validateInterCode = {
      validate: function (value) {
        if (value.length < 1) {
          self.bicCodeError(true);
        } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
          self.bicCodeError(true);
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.instructionDetails.invalidSwiftId));
        } else {
          self.bicCodeError(false);
        }
      }
    };

    if (self.beneName) {
      self.existingBene = ko.observable("false");

    }

    self.resetAvailableWith = function () {
      self.availableWithDetails(null);
      self.lcAmendmentDetails.availableWith("");
    };

    AmendLetterOfCreditModel.fetchGoods().done(function (goodsData) {
      const goods = goodsData.goods.map(function (data) {
        return {
          description: data.description,
          value: data.code,
          label: data.code
        };
      });

      self.goodsTypeOptions(goods);
      self.dropdownListLoaded.goods(true);
    });

    self.goodsTypeHandler = function (data, event) {
      let selectedgoodsValue;

      if (event.detail && event.detail.value) {
        //This will handle case of entity 14
        selectedgoodsValue = event.detail.value;
      } else if (data.detail && data.detail.value) {
        //This will handle case of entity 12.0
        selectedgoodsValue = data.detail.value;
      }

      const selectedgoodsCodeArray = self.goodsTypeOptions().filter(function (data) {
        return data.value === selectedgoodsValue;
      });

      if (self.multiGoodsSupported()) {
        self.goodsArray()[data].description(selectedgoodsCodeArray[0].description);
        self.goodsArray()[data].code(selectedgoodsValue);
      } else if (self.lcAmendmentDetails.shipmentDetails.goodsCode() !== selectedgoodsCodeArray[0].value) {
        self.lcAmendmentDetails.shipmentDetails.goodsCode(selectedgoodsCodeArray[0].value);
        self.lcAmendmentDetails.shipmentDetails.description(selectedgoodsCodeArray[0].description);
      }
    };

    AmendLetterOfCreditModel.fetchIncoterm().done(function (incotermData) {
      const incotermList = incotermData.incotermList.map(function (data) {
        return {
          value: data.code,
          label: data.description
        };
      });

      self.incotermTypeOptions(incotermList);
      self.dropdownListLoaded.incoterm(true);
    });

    self.openLookup = function () {
      self.clearingCodeType("SWI");
      $("#menuButtonDialog").trigger("openModal");
    };

    self.selectAllDocListener = function (event) {
      let allDocsSelected = "false";

      if (event.detail.value.length > 0 && event.detail.value[0] === "true") {
        allDocsSelected = "true";
      }

      for (i = 0; i < self.docArray().length; i++) {
        self.docArray()[i].docSelected([allDocsSelected]);
      }
    };

    self.docSelectionHandler = function (event) {
      if (event.detail.value) {
        const docId = event.target.id.split("_")[1];

        self.docArray().forEach(function (entry) {
          if (entry.id === docId) {
            entry.copies(0);
            entry.originals(0);
            entry.originalsOutOff(0);

            entry.clause.forEach(function (clause) {
              clause.selected([false]);
            });
          }
        });

        self.clauseTableArray.remove(function (clauseData) {
          if (clauseData.docId === docId) {
            return true;
          }

          return false;
        });
      }
    };

    self.selectAllClauseListener = function (data, event) {
      let allClauseSelected = "false";

      if (event.detail.value && event.detail.value.length > 0 && event.detail.value[0] === "true") {
        allClauseSelected = "true";
      }

      for (i = 0; i < self.docArray().length; i++) {
        if (self.docArray()[i].id === data) {
          for (let j = 0; j < self.docArray()[i].clause.length; j++) {
            self.docArray()[i].clause[j].selected([allClauseSelected]);
          }
        }
      }
    };

    self.showPreviousValue = function (previousValue) {
      const popup = document.querySelector("#lc-amendment-popup");

      self.previousValue(params.baseModel.format(self.resourceBundle.labels.prevValueLabel, { prevValueLabel: previousValue }));

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#prev-transferrable-type");
      }
    };

    self.countryChangeHandler = function (event) {
      let countryLabel;

      if (event.detail.value) {
        const country = event.detail.value;

        countryLabel = self.beneCountryoptions().filter(function (data) {
          return data.value === country;
        });

        if (countryLabel && countryLabel.length > 0) {
          self.benecountryName(countryLabel[0].label);
        }
      }
    };

    AmendLetterOfCreditModel.fetchBeniCountry().done(function (taskData) {
      const countries = taskData.enumRepresentations[0].data.map(function (data) {
        return {
          value: data.code,
          label: data.description
        };
      }).filter(function (data) {
        return data.label && data.value;
      });

      self.beneCountryoptions(countries);
    });

    AmendLetterOfCreditModel.fetchBeneName().done(function (beneData) {
      const beneficiary = beneData.beneficiaryDTOs.map(function (data) {
        return {
          value: data.id,
          label: data.name
        };
      });

      self.beneIdOptions(beneficiary);
    });

    self.partialShipmentOptionsArray = ko.observable([
      {
        label: self.resourceBundle.common.labels.allowed,
        value: "Y"
      },
      {
        label: self.resourceBundle.common.labels.notAllowed,
        value: "N"
      },
      {
        label: self.resourceBundle.shipmentDetails.labels.conditional,
        value: "C"
      }
    ]);

    self.transShipmentOptionsArray = ko.observable([
      {
        label: self.resourceBundle.common.labels.allowed,
        value: "Y"
      },
      {
        label: self.resourceBundle.common.labels.notAllowed,
        value: "N"
      },
      {
        label: self.resourceBundle.shipmentDetails.labels.conditional,
        value: "C"
      }
    ]);

    self.amendStages = [{
      stageName: self.resourceBundle.heading.general,
      expanded: ko.observable(true),
      templateName: ko.observable("trade-finance/amend-lc-details"),
      editable: true,
      validated: ko.observable()
    },
    {
      stageName: self.resourceBundle.heading.shipment,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/amend-shipment-details"),
      editable: true,
      validated: ko.observable()
    },
    {
      stageName: self.resourceBundle.heading.documents,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/amend-document-details"),
      editable: false,
      validated: ko.observable()
    },
    {
      stageName: self.resourceBundle.heading.instructions,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/amend-instructions-details"),
      editable: true,
      validated: ko.observable()
    }
    ];

    if (self.letterOfCreditDetails.lcType === "Export") {
      params.dashboard.headerName(self.resourceBundle.heading.initiateExportLCAmendment);
    } else {
      params.dashboard.headerName(self.resourceBundle.heading.initiateLCAmendment);
    }

    self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.lcNumber, {
      lcNumber: self.letterOfCreditDetails.id
    }));

    const getNewKoModel = function () {
      const KoModel = AmendLetterOfCreditModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.tncValue = ko.observable([]);
    self.tncValidationTracker = ko.observable();
    self.lcDetailsValidationTracker = ko.observable();
    self.shipmentDetailsValidationTracker = ko.observable();
    self.instructionDetailsValidationTracker = ko.observable();
    self.minEffectiveDate = ko.observable();
    self.docTblColumns = null;

    self.chargesBorneByTypeOptions = ko.observableArray([{
      value: "BYAPPLICANT",
      label: self.resourceBundle.instructionsDetails.labels.BYAPPLICANT
    },
    {
      value: "BYCOUNTERPARTY",
      label: self.resourceBundle.instructionsDetails.labels.BYCOUNTERPARTY
    }
    ]);

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

    AmendLetterOfCreditModel.fetchBranchDate(self.letterOfCreditDetails.branchId).done(function (res) {
      const date = new Date(res.branchDate);

      date.setDate(date.getDate() + 1);
      self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
    });

    function editMode() {

      if (self.mode() === "EDIT") {
        self.confirmationInstruction([self.lcAmendmentDetails.confirmationInstruction()]);

        if (ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationParty)) {
          self.requestedConfirmationParty([self.lcAmendmentDetails.requestedConfirmationParty()]);
          self.requestedConfirmationPartyLoaded(true);

          if (ko.utils.unwrapObservable(self.lcAmendmentDetails.advisingThroughBankCode) || ko.utils.unwrapObservable(self.lcAmendmentDetails.confirmingBankCode)) {
            self.confirmationInstructionBankCode(self.lcAmendmentDetails.advisingThroughBankCode && self.lcAmendmentDetails.advisingThroughBankCode() ? self.lcAmendmentDetails.advisingThroughBankCode() : self.lcAmendmentDetails.confirmingBankCode());
            self.requestedConfirmationPartyMode("SWIFTCODE");
            self.lcAmendmentDetails.requestedConfirmationPartyDetails = getNewKoModel().AmendedLCDetails.requestedConfirmationPartyDetails;

            AmendLetterOfCreditModel.getBankDetailsBIC(self.confirmationInstructionBankCode()).done(function (data) {
              delete data.status;
              self.requestedConfirmationPartyDetails(data);
              self.partyDetailsloaded(true);
            });

            self.bankDetailsLoaded(true);
          } else if (self.lcAmendmentDetails.requestedConfirmationParty() !== "ABK") {
            self.requestedConfirmationPartyMode("BANKADDRESS");
            self.requestedConfirmationPartyDetails(ko.utils.unwrapObservable(self.lcAmendmentDetails.requestedConfirmationPartyDetails));
            self.bankDetailsLoaded(true);
          }
        }

        if (self.lcAmendmentDetails.transferableType() === "DEFFEREDPAYMENT" || self.lcAmendmentDetails.transferableType() === "MIXEDPAYMENT") {
          self.transferableTypeValueLoaded(true);
        }
        else {
          self.transferableTypeValueLoaded(false);
        }

        if (self.lcAmendmentDetails.shipmentDetails.date && self.lcAmendmentDetails.shipmentDetails.date() !== null) {
          self.shipmentDatePeriodRadioSetValue("latestdateofShipment");
        } else if (self.lcAmendmentDetails.shipmentDetails.period() && self.lcAmendmentDetails.shipmentDetails.period() !== null) {
          self.shipmentDatePeriodRadioSetValue("latestperiodofShipment");
        }

      }

    }

    editMode();

    function loadDataIntoModel() {
      self.lcAmendmentDetails.lcId(self.letterOfCreditDetails.id);
      self.lcAmendmentDetails.issueDate(self.letterOfCreditDetails.applicationDate);
      self.lcAmendmentDetails.partyId.displayValue(self.letterOfCreditDetails.partyId.displayValue);
      self.lcAmendmentDetails.partyId.value(self.letterOfCreditDetails.partyId.value);
      self.lcAmendmentDetails.newAmount.amount(self.letterOfCreditDetails.amount.amount);
      self.lcAmendmentDetails.newAmount.currency(self.letterOfCreditDetails.amount.currency);
      self.lcAmendmentDetails.newExpiryDate(self.letterOfCreditDetails.expiryDate);
      self.lcAmendmentDetails.toleranceType(self.letterOfCreditDetails.toleranceType);
      self.lcAmendmentDetails.toleranceUnder(self.letterOfCreditDetails.toleranceUnder);
      self.lcAmendmentDetails.toleranceAbove(self.letterOfCreditDetails.toleranceAbove);
      self.lcAmendmentDetails.expiryPlace(self.letterOfCreditDetails.expiryPlace);
      ko.utils.extend(self.lcAmendmentDetails.shipmentDetails, self.letterOfCreditDetails.shipmentDetails);
      self.lcAmendmentDetails.shipmentDetails = ko.mapping.fromJS(self.lcAmendmentDetails.shipmentDetails);

      if (self.lcAmendmentDetails.shipmentDetails.date && self.lcAmendmentDetails.shipmentDetails.date() !== null) {
        self.shipmentDatePeriodRadioSetValue("latestdateofShipment");
      } else if (self.lcAmendmentDetails.shipmentDetails.period() && self.lcAmendmentDetails.shipmentDetails.period() !== null) {
        self.shipmentDatePeriodRadioSetValue("latestperiodofShipment");
      }

      self.lcAmendmentDetails.documentPresentationDays(self.letterOfCreditDetails.documentPresentationDays);
      self.lcAmendmentDetails.confirmationInstruction(self.letterOfCreditDetails.confirmationInstruction);
      self.lcAmendmentDetails.requestedConfirmationParty(self.letterOfCreditDetails.requestedConfirmationParty);
      self.lcAmendmentDetails.advisingThroughBankCode(self.letterOfCreditDetails.advisingThroughBankCode);
      self.lcAmendmentDetails.confirmingBankCode(self.letterOfCreditDetails.confirmingBankCode);
      self.requestedConfirmationPartyDetails(self.letterOfCreditDetails.requestedConfirmationPartyDetails);

      if (self.letterOfCreditDetails.requestedConfirmationPartyDetails && self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress) {
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.name(self.letterOfCreditDetails.requestedConfirmationPartyDetails.name);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line1(self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line1);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line2(self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line2);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line3(self.letterOfCreditDetails.requestedConfirmationPartyDetails.branchAddress.line3);
      }

      self.lcAmendmentDetails.transferableType(self.letterOfCreditDetails.transferableType);

      if (self.lcAmendmentDetails.advisingThroughBankCode() || self.lcAmendmentDetails.confirmingBankCode()) {
        self.requestedConfirmationPartyMode("SWIFTCODE");
      } else {
        self.requestedConfirmationPartyMode("BANKADDRESS");
      }

      if (self.lcAmendmentDetails.requestedConfirmationParty() !== "ABK") {
        self.bankDetailsLoaded(true);
      } else {
        self.bankDetailsLoaded(false);
      }

      /* setting data from beneAddress to amendment payload*/
      self.lcAmendmentDetails.counterPartyAddress.line1(self.beneAddress.line1());
      self.lcAmendmentDetails.counterPartyAddress.line2(self.beneAddress.line2());
      self.lcAmendmentDetails.counterPartyAddress.line3(self.beneAddress.line3());
      self.lcAmendmentDetails.counterPartyAddress.country(self.letterOfCreditDetails.counterPartyAddress.country);
      self.benecountryName(self.beneAddress.country());
      self.lcAmendmentDetails.counterPartyName(self.beneName);
      self.lcAmendmentDetails.shipmentDetails.period = ko.mapping.fromJS(self.lcAmendmentDetails.shipmentDetails.period);
      self.lcAmendmentDetails.shipmentDetails.date = ko.mapping.fromJS(self.letterOfCreditDetails.shipmentDetails.date);
      self.lcAmendmentDetails.availableWith(self.letterOfCreditDetails.availableWith);

      self.lcAmendmentDetails.chargesBorneBy(self.letterOfCreditDetails.chargesBorneBy);
      self.lcAmendmentDetails.transferableType(self.letterOfCreditDetails.transferableType);

      self.lcAmendmentDetails.chargesFromBeneficiary(self.letterOfCreditDetails.chargesFromBeneficiary);

      if (self.letterOfCreditDetails.counterPartyAddress !== null) {
        self.lcAmendmentDetails.counterPartyAddress = ko.mapping.fromJS(self.letterOfCreditDetails.counterPartyAddress);
      }

      if (self.letterOfCreditDetails.transferableType === "DEFFEREDPAYMENT" || self.letterOfCreditDetails.transferableType === "MIXEDPAYMENT") {
        self.lcAmendmentDetails.paymentDetails(self.letterOfCreditDetails.paymentDetails);
        self.transferableTypeValueLoaded(true);
      }
      else {
        self.transferableTypeValueLoaded(false);
      }

      self.lcAmendmentDetails.validBICCode(self.letterOfCreditDetails.validBICCode);

      if (self.lcAmendmentDetails.validBICCode()) {
        self.creditAvailableWithSelected = ko.observable("SWIFTCODE");
      }
      else {
        self.creditAvailableWithSelected = ko.observable("BANKADDRESS");
      }

      self.lcAmendmentDetails.chargesFromBeneficiary(self.letterOfCreditDetails.chargesFromBeneficiary);

      if (self.letterOfCreditDetails.counterPartyAddress !== null) {
        self.lcAmendmentDetails.counterPartyAddress = ko.mapping.fromJS(self.letterOfCreditDetails.counterPartyAddress);
      }

      if (self.letterOfCreditDetails.transferableType === "DEFFEREDPAYMENT" || self.letterOfCreditDetails.transferableType === "MIXEDPAYMENT") {
        self.lcAmendmentDetails.paymentDetails(self.letterOfCreditDetails.paymentDetails);
        self.transferableTypeValueLoaded(true);
      }
      else {
        self.transferableTypeValueLoaded(false);
      }

      self.lcAmendmentDetails.validBICCode(self.letterOfCreditDetails.validBICCode);

      if (self.lcAmendmentDetails.validBICCode()) {
        self.creditAvailableWithSelected = ko.observable("SWIFTCODE");
      }
      else {
        self.creditAvailableWithSelected = ko.observable("BANKADDRESS");
      }

      self.lcAmendmentDetails.draftsRequired = ko.observable((!!self.billingDraftsLoaded()).toString());

      for (let k = 0; k < self.letterOfCreditDetails.document.length; k++) {
        self.lcAmendmentDetails.document.push(self.letterOfCreditDetails.document[k]);
      }

      self.dataLoaded(true);
    }

    function setConfirmationOptions() {
      AmendLetterOfCreditModel.fetchConfirmationParty().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.requestedConfirmationPartyOptions.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }
      });

      AmendLetterOfCreditModel.fetchConfirmationInstruction().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.confirmationInstructionOptions.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }
      });
    }

    if (self.requestedConfirmationPartyOptions && self.requestedConfirmationPartyOptions().length === 0) {
      setConfirmationOptions();
    }

    self.requestedConfirmationPartyDescription = ko.computed(function () {
      if (self.requestedConfirmationPartyOptions && self.requestedConfirmationParty) {
        return params.baseModel.getDescriptionFromCode(self.requestedConfirmationPartyOptions(), self.requestedConfirmationParty(), "value", "label");
      }
    });

    self.openConfirmationinstructionLookup = function () {
      self.clearingCodeType("SWI");
      $("#openConfirmationinstructionLookup").trigger("openModal");
    };

    self.validateInterCode = {
      validate: function (value) {
        if (value.length < 1) {
          self.bicCodeError(true);
        } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
          self.bicCodeError(true);
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.instructionDetails.invalidSwiftId));
        } else {
          self.bicCodeError(false);
        }
      }
    };

    self.requestedConfirmationPartyDescription = ko.computed(function () {
      if (self.requestedConfirmationPartyOptions && self.requestedConfirmationParty) {
        return params.baseModel.getDescriptionFromCode(self.requestedConfirmationPartyOptions(), self.requestedConfirmationParty(), "value", "label");
      }
    });

    self.confirmationInstructionChangeHandler = function (event) {
      self.confirmationInstruction(event.detail.value);

      if (event.detail.value !== "WITHOUT") {
        self.requestedConfirmationPartyLoaded(true);
      }
      else {
        self.lcAmendmentDetails.requestedConfirmationParty(null);
        self.requestedConfirmationPartyLoaded(false);
      }

      if (event.detail.trigger) {
        self.requestedConfirmationParty(null);
        self.partyDetailsloaded(false);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.name(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line1(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line2(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line3(null);
        self.requestedConfirmationPartyDetails(null);
        self.lcAmendmentDetails.advisingThroughBankCode(null);
        self.lcAmendmentDetails.confirmingBankCode(null);
        self.bankDetailsLoaded(false);
      }
    };

    self.requestedConfirmationPartyChangeHandler = function (event) {
      self.requestedConfirmationParty(event.detail.value);

      self.requestedConfirmationPartyOptions().forEach(function (element) {
        if (self.requestedConfirmationParty() === element.value) {
          self.lcAmendmentDetails.requestedConfirmationParty(element.key);
        }
      });

      if (event.detail.value !== "ABK") {
        self.bankDetailsLoaded(true);

        if (!self.params.requestedConfirmationPartyMode) { self.requestedConfirmationPartyMode("SWIFTCODE"); }
      }
      else {
        self.lcAmendmentDetails.advisingThroughBankCode(null);
        self.lcAmendmentDetails.confirmingBankCode(null);
        self.bankDetailsLoaded(false);
      }

      if (event.detail.trigger) {
        self.partyDetailsloaded(false);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.name(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line1(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line2(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line3(null);
        self.requestedConfirmationPartyDetails(null);
        self.confirmationInstructionBankCode(null);
      }
    };

    self.requestedConfirmationPartyModeChangeHandler = function (event) {
      if (event.detail.trigger) {
        self.lcAmendmentDetails.advisingThroughBankCode(null);
        self.lcAmendmentDetails.confirmingBankCode(null);
        self.requestedConfirmationPartyDetails(null);
        self.confirmationInstructionBankCode(null);
        self.partyDetailsloaded(false);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.name(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line1(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line2(null);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line3(null);
      }
    };

    self.requestedConfirmationPartyDetailsSubscribe = self.requestedConfirmationPartyDetails.subscribe(function (newValue) {
      if (newValue !== null) {
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.code = ko.observable(self.requestedConfirmationPartyDetails().code);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.name(self.requestedConfirmationPartyDetails().name);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line1(self.requestedConfirmationPartyDetails().branchAddress.line1);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line2(self.requestedConfirmationPartyDetails().branchAddress.line2);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line3(self.requestedConfirmationPartyDetails().branchAddress.line3);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.city = ko.observable(self.requestedConfirmationPartyDetails().branchAddress.city);
        self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.country = ko.observable(self.requestedConfirmationPartyDetails().branchAddress.country);
        self.partyDetailsloaded(true);
      }

    });

    self.verifyConfInstBankCode = function () {

      const trackerSwift = document.getElementById("requestedConfirmationPartyMode");

      if (trackerSwift.valid === "valid") {
        if (!self.bicCodeError()) {
          AmendLetterOfCreditModel.getBankDetailsBIC(self.confirmationInstructionBankCode()).done(function (data) {
            self.requestedConfirmationPartyDetails(data);
            self.partyDetailsloaded(false);
            self.lcAmendmentDetails.requestedConfirmationPartyDetails = ko.mapping.fromJS(data);
            delete self.lcAmendmentDetails.requestedConfirmationPartyDetails.status;
            self.partyDetailsloaded(true);
          });
        }
      } else {
        trackerSwift.showMessages();
        trackerSwift.focusOn("@firstInvalidShown");
      }
    };

    self.resetConfInstBankDetails = function () {
      self.requestedConfirmationPartyDetails(null);
      self.partyDetailsloaded(false);
      self.lcAmendmentDetails.requestedConfirmationPartyDetails.name(null);
      self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line1(null);
      self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line2(null);
      self.lcAmendmentDetails.requestedConfirmationPartyDetails.branchAddress.line3(null);
      self.requestedConfirmationPartyMode("SWIFTCODE");
      self.confirmationInstructionBankCode(null);
    };

    if (self.mode() === "CREATE") {
      self.rootModelInstance = ko.observable(getNewKoModel());
      self.lcAmendmentDetails = self.rootModelInstance().AmendedLCDetails;

      loadDataIntoModel();

      //Load goods into local array when multiple goods are supported
      if (self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported === "Y") {
        if (self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0) {
          self.goodsArray.removeAll();

          for (i = 0; i < self.letterOfCreditDetails.goods.length; i++) {
            self.goodsArray.push({
              id: i + 1,
              code: ko.observable(self.letterOfCreditDetails.goods[i].code),
              description: ko.observable(self.letterOfCreditDetails.goods[i].description),
              noOfUnits: self.letterOfCreditDetails.goods[i].noOfUnits ? ko.observable(self.letterOfCreditDetails.goods[i].noOfUnits) : ko.observable(null),
              pricePerUnit: self.letterOfCreditDetails.goods[i].pricePerUnit ? ko.observable(self.letterOfCreditDetails.goods[i].pricePerUnit) : ko.observable(null)
            });
          }

          self.goodsArrayOriginal = ko.mapping.fromJS(ko.mapping.toJS(self.goodsArray()));
        } else {
          self.goodsArray.removeAll();
        }
      }

      // Load drafts into local array when drafts required is true
      if (self.letterOfCreditDetails.draftsRequired) {
        if (self.letterOfCreditDetails.billingDrafts && self.letterOfCreditDetails.billingDrafts.length > 0) {
          self.lcAmendmentDetails.draftsRequired = ko.observable("true");
          self.draftArray.removeAll();
          self.draweeBank(self.letterOfCreditDetails.billingDrafts[0].draweeBankId);

          for (i = 0; i < self.letterOfCreditDetails.billingDrafts.length; i++) {
            self.draftArray.push({
              id: i + 1,
              tenor: ko.observable(self.letterOfCreditDetails.billingDrafts[i].tenor),
              otherInformation: ko.observable(self.letterOfCreditDetails.billingDrafts[i].otherInformation),
              draweeBankId: self.draweeBank,
              amount: ko.observable(self.letterOfCreditDetails.billingDrafts[i].amount)
            });
          }

          self.billingDraftsLoaded(true);
          self.draftArrayOriginal = ko.mapping.fromJS(ko.mapping.toJS(self.draftArray()));
        } else {
          self.draftArray.removeAll();
        }
      } else {
        self.lcAmendmentDetails.draftsRequired = ko.observable("false");
      }
    } else {
      self.dataLoaded(true);
    }

    self.remainingDays = ko.computed(function () {
      if (self.letterOfCreditDetails.applicationDate !== null && ko.utils.unwrapObservable(self.lcAmendmentDetails.newExpiryDate) !== null) {
        const curDate = new Date(self.letterOfCreditDetails.applicationDate),
          expiryDate = new Date(ko.utils.unwrapObservable(self.lcAmendmentDetails.newExpiryDate));
        let daysBeforeExpiryDate = parseInt((expiryDate - curDate) / (1000 * 60 * 60 * 24));

        daysBeforeExpiryDate = daysBeforeExpiryDate + 1;

        return daysBeforeExpiryDate;
      }

      return 365;
    });

    self.exposureAmount = ko.computed(function () {
      if (ko.utils.unwrapObservable(self.lcAmendmentDetails.newAmount.amount) === null) {
        return 0;
      }

      return (parseFloat(ko.utils.unwrapObservable(self.lcAmendmentDetails.newAmount.amount) * 0.01 * ko.utils.unwrapObservable(self.lcAmendmentDetails.toleranceAbove)) + parseFloat(ko.utils.unwrapObservable(self.lcAmendmentDetails.newAmount.amount))).toFixed(2);
    });

    self.shipmentRadioBtnSubscribe = self.shipmentDatePeriodRadioSetValue.subscribe(function (newValue) {
      if (self.mode() !== "ACCEPTANCE" && self.mode() !== "VIEW") {
        if (newValue === "latestdateofShipment") {
          self.lcAmendmentDetails.shipmentDetails.period(null);
        } else if (newValue === "latestperiodofShipment") {
          self.lcAmendmentDetails.shipmentDetails.date(null);
        }
      }
    });

    self.termsAndConditions = function () {
      $("#tncDialog").trigger("openModal");
    };

    self.hideTncDialog = function () {
      $("#tncDialog").hide();
    };

    function validate() {
      let validationFlag = true;
      const amendLcTracker = document.getElementById("amendLcTracker");

      if (amendLcTracker.valid === "valid") {
        self.amendStages[0].validated(true);
      } else {
        self.amendStages[0].validated(false);
        validationFlag = false;
        amendLcTracker.showMessages();
        amendLcTracker.focusOn("@firstInvalidShown");
      }

      const amendShipmentTracker = document.getElementById("amendShipmentTracker");

      if (amendShipmentTracker.valid === "valid") {
        self.amendStages[1].validated(true);
      } else {
        self.amendStages[1].validated(false);
        validationFlag = false;
        amendShipmentTracker.showMessages();
        amendShipmentTracker.focusOn("@firstInvalidShown");
      }

      const amendInsturctionsTracker = document.getElementById("amendInsturctionsTracker");

      if (amendInsturctionsTracker.valid === "valid") {
        self.amendStages[3].validated(true);
      } else {
        self.amendStages[3].validated(false);
        validationFlag = false;
        amendInsturctionsTracker.showMessages();
        amendInsturctionsTracker.focusOn("@firstInvalidShown");
      }

      const tncTracker = document.getElementById("tncTracker");

      if (tncTracker.valid !== "valid") {
        validationFlag = false;
        tncTracker.showMessages();
        tncTracker.focusOn("@firstInvalidShown");
      }

      return validationFlag;
    }

    self.amendLC = function () {
      self.lcAmendmentDetails.draftsRequired(self.lcAmendmentDetails.draftsRequired() === "true");

      if (self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported === "Y") {
        totalGoodsAmount = 0;
        self.lcAmendmentDetails.goods.removeAll();

        if (self.goodsArray().length > 0) {
          for (i = 0; i < self.goodsArray().length; i++) {
            self.lcAmendmentDetails.goods.push({
              code: self.goodsArray()[i].code(),
              description: self.goodsArray()[i].description(),
              noOfUnits: self.goodsArray()[i].noOfUnits(),
              pricePerUnit: self.goodsArray()[i].pricePerUnit()
            });

            totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].noOfUnits() * self.goodsArray()[i].pricePerUnit());
          }
        }

        if (totalGoodsAmount > self.lcAmendmentDetails.newAmount.amount()) {
          params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidGoodsAmount], "ERROR");

          return;
        }
      } else {
        self.lcAmendmentDetails.goods.push({
          code: self.lcAmendmentDetails.shipmentDetails.goodsCode(),
          description: self.lcAmendmentDetails.shipmentDetails.description(),
          noOfUnits: null,
          pricePerUnit: null
        });
      }

      self.createModelFromArray();

      if (self.bankAddressOne && self.bankAddressOne() !== "") {
        let final = self.bankAddressOne();

        if (self.bankAddressTwo && self.bankAddressTwo() !== "") {
          final = final + "_" + self.bankAddressTwo();
        }

        if (self.bankAddressThree && self.bankAddressThree() !== "") {
          final = final + "_" + self.bankAddressThree();
        }

        self.lcAmendmentDetails.bankAddress(final);
      }

      self.getDocumentDetails = function () {
        if (self.lcAmendmentDetails.document() && self.lcAmendmentDetails.document().length > 0) {
          self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.lcAmendmentDetails.document, {
            idAttribute: "id"
          }));

          self.clauseTableArrayForReview.removeAll();

          for (i = 0; i < self.lcAmendmentDetails.document().length; i++) {
            if (self.lcAmendmentDetails.document()[i].clause && self.lcAmendmentDetails.document()[i].clause.length > 0) {
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

      self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsArray, {
        idAttribute: "id"
      });

      if (self.lcAmendmentDetails.shipmentDetails.partial() === "") {
        self.lcAmendmentDetails.shipmentDetails.partial(null);
      }

      if (self.lcAmendmentDetails.shipmentDetails.transShipment() === "") {
        self.lcAmendmentDetails.shipmentDetails.transShipment(null);
      }

      if (validate()) {
        const parameters = {
          mode: "REVIEW",
          lcAmendmentDetails: ko.mapping.toJS(self.lcAmendmentDetails),
          amendStages: ko.mapping.toJS(self.amendStages),
          letterOfCreditDetails: ko.mapping.toJS(self.letterOfCreditDetails),
          dropdownLabels: self.dropdownLabels,
          showDocuments: self.showDocuments,
          applicantName: self.applicantName(),
          datasourceForDocReview: self.datasourceForDocReview,
          goodsArrayOriginal: self.goodsArrayOriginal,
          goodsArray: self.goodsArray,
          billingDraftsLoaded: self.billingDraftsLoaded(),
          draftArray: self.draftArray,
          draftArrayOriginal: self.draftArrayOriginal,
          docArray: self.docArray,
          documentDetailsOriginal: self.letterOfCreditDetails.document,
          multiGoodsSupported: self.multiGoodsSupported,
          bankAddressOne: self.bankAddressOne,
          bankAddressTwo: self.bankAddressTwo,
          bankAddressThree: self.bankAddressThree,
          confirmationInstructionOptions: self.confirmationInstructionOptions,
          requestedConfirmationPartyOptions: self.requestedConfirmationPartyOptions,
          requestedConfirmationPartyMode: self.requestedConfirmationPartyMode(),
          requestedConfirmationPartyDetails: self.requestedConfirmationPartyDetails,
          availableWithDetails: self.availableWithDetails,
          additionalBankDetails: self.additionalBankDetails,
          creditAvailableWithSelected: self.creditAvailableWithSelected,
          draweeBank: self.draweeBank,
          bankDetailsLoaded: self.bankDetailsLoaded,
          confirmationInstructionBankCode: self.confirmationInstructionBankCode,
          transferableTypevalueOptions: self.transferableTypevalueOptions
        };

        self.checkIfLcDetailsLoaded(true);
        params.dashboard.loadComponent("review-amend-lc", parameters);
      }
    };

    self.draftsRequiredChangeHandler = function (event) {
      self.draftArray.removeAll();

      if (event.detail.value && event.detail.value === "true") {
        self.draftArray.push({
          id: 1,
          amount: {
            amount: ko.observable(),
            currency: self.letterOfCreditDetails.amount.currency
          },
          draftName: ko.observable(""),
          draweeBankId: self.draweeBank,
          otherInformation: ko.observable(""),
          tenor: ko.observable("0")
        });

        self.billingDraftsLoaded(true);
      } else {
        self.billingDraftsLoaded(false);
      }
    };

    self.validateLCAmount = {
      validate: function (value) {
        if (value) {
          if (value <= 0) {
            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.invalidAmountErrorMessage);
          }

          const numberfractional1 = value.toString().split(".");

          if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
          }

          if (numberfractional1[1]) {
            if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
              throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
            }
          }
        }

        return true;
      }
    };

    self.docSelectionHandler = function (event) {
      if (event.detail.value) {
        const docId = event.target.id.split("_")[1];

        self.docArray().forEach(function (entry) {
          if (entry.id === docId) {
            entry.copies(0);
            entry.originals(0);
            entry.originalsOutOff(0);

            entry.clause.forEach(function (clause) {
              clause.selected([false]);
            });
          }
        });

        self.clauseTableArray.remove(function (clauseData) {
          if (clauseData.docId === docId) {
            return true;
          }

          return false;
        });
      }
    };

    function fetchBeneUserDetails(beneficiaryId) {
      AmendLetterOfCreditModel.fetchBeneficiaryDetails(beneficiaryId).done(function (data) {
        self.lcAmendmentDetails.counterPartyName(data.beneficiaryDTO.name);
        self.lcAmendmentDetails.counterPartyAddress.line1(data.beneficiaryDTO.address.line1);
        self.lcAmendmentDetails.counterPartyAddress.line2(data.beneficiaryDTO.address.line2);
        self.lcAmendmentDetails.counterPartyAddress.line3(data.beneficiaryDTO.address.line3);
        self.lcAmendmentDetails.counterPartyAddress.country(data.beneficiaryDTO.address.country);
        self.benecountry(data.beneficiaryDTO.address.country);

        const countryLabel = self.beneCountryoptions().filter(function (data) {
          return data.value === self.benecountry();
        });

        self.beneVisibility(data.beneficiaryDTO.visibility);

        if (countryLabel && countryLabel.length > 0) {
          self.dropdownLabels.country(countryLabel[0].label);
        }

      });
    }

    self.beneSubscribe = self.beneId && self.beneId.subscribe(function (newValue) {
      if (newValue !== null) {
        fetchBeneUserDetails(newValue);
      }
    });

    self.existingBeneSubscribe = self.existingBene && self.existingBene.subscribe(function () {
      self.beneId(null);
      self.lcAmendmentDetails.counterPartyName(null);
      self.lcAmendmentDetails.counterPartyAddress.line1(null);
      self.lcAmendmentDetails.counterPartyAddress.line2(null);
      self.lcAmendmentDetails.counterPartyAddress.line3(null);
      self.lcAmendmentDetails.counterPartyAddress.country(null);
      self.additionalBankDetails(null);
      self.benecountry([]);
    });

    self.verifyAvailableCode = function () {

      const trackerSwift = document.getElementById("creditAvailableWith");

      if (trackerSwift.valid === "valid") {
        if (!self.bicCodeError()) {
          AmendLetterOfCreditModel.getBankDetailsBIC(self.lcAmendmentDetails.availableWith()).done(function (data) {
            self.availableWithDetails(data);
          }).fail(function () {
            self.lcAmendmentDetails.availableWith("");
          });
        }
      } else {
        trackerSwift.showMessages();
        trackerSwift.focusOn("@firstInvalidShown");
      }
    };

    self.addGoods = function () {
      //Maximum 5 goods rows can be added
      if ((self.goodsArray().length + 1) <= 5) {
        self.goodsArray.push({
          id: ko.observable(self.goodsArray().length + 1),
          code: ko.observable(""),
          description: ko.observable(""),
          noOfUnits: ko.observable(""),
          pricePerUnit: ko.observable("")
        });
      } else {
        params.baseModel.showMessages(null, [self.resourceBundle.shipmentDetails.labels.maxGoodLimit], "ERROR");
      }
    };

    function findIndexInData(data, value) {
      for (i = 0; i < data.length; i++) {
        if (data[i].id === value) {
          return i;
        }
      }

      return -1;
    }

    self.removeGoods = function (data) {
      const index = findIndexInData(self.goodsArray(), data.id);

      self.goodsArray.splice(index, 1);
    };

    let draftRowId = 1;

    self.addDraft = function () {
      self.draftArray.push({
        id: ++draftRowId,
        draftName: ko.observable(""),
        tenor: ko.observable("0"),
        amount: ko.observable({
          amount: ko.observable(),
          currency: self.letterOfCreditDetails.amount.currency
        }),
        draweeBankId: self.draweeBank,
        otherInformation: ko.observable("")
      });
    };

    self.removeDraft = function (data) {
      self.draftArray.splice(data, 1);
      --draftRowId;
    };

    if (self.mode() === "CREATE") {
      AmendLetterOfCreditModel.fetchProductDetails(self.letterOfCreditDetails.productId).done(function (productData) {
        const productDetails = productData.letterOfCreditProductDTO;

        if (productDetails) {
          if (productDetails.periodIndicator === "SIGHT") {
            self.disbaledTenor(true);

            for (i = 0; i < self.draftArray().length; i++) {
              self.draftArray()[i].tenor("0");
            }
          } else {
            self.disbaledTenor(false);
          }

          let documentExisting;

          self.showDocuments(false);
          self.docArray.removeAll();
          self.clauseTableArray.removeAll();

          for (i = 0; i < productDetails.documents.length; i++) {
            const clause = [];

            for (j = 0; j < productDetails.documents[i].clause.length; j++) {
              clause.push({
                selected: ko.observable([false]),
                rowId: productDetails.documents[i].id + "_" + productDetails.documents[i].clause[j].id,
                id: productDetails.documents[i].clause[j].id,
                description: ko.observable(productDetails.documents[i].clause[j].description),
                name: productDetails.documents[i].clause[j].name
              });
            }

            documentExisting = self.letterOfCreditDetails.document.filter(function (data) {
              return data.id === productDetails.documents[i].id;
            });

            for (let k = 0; k < documentExisting.length; k++) {
              let clauseSelected = "false",
                clauseDesc = documentExisting[k].description;

              if (documentExisting[k].clause) {
                for (let l = 0; l < documentExisting[k].clause.length; l++) {
                  if (documentExisting[k].clause[l].id) {
                    clauseSelected = "true";
                    clauseDesc = documentExisting[k].clause[l].description;

                    clause.push({
                      selected: ko.observable([clauseSelected]),
                      rowId: productDetails.documents[i].id + "_" + documentExisting[k].clause[l].name,
                      id: documentExisting[k].clause[l].id,
                      description: ko.observable(clauseDesc),
                      name: documentExisting[k].clause[l].name
                    });
                  }
                }
              }
            }

            if (documentExisting && documentExisting.length > 0) {
              self.docArray.push({
                docSelected: ko.observable(["true"]),
                id: documentExisting[0].id,
                clause: clause,
                copies: ko.observable(documentExisting[0].copies),
                name: documentExisting[0].name,
                originals: ko.observable(documentExisting[0].originals.substring(0, 1)),
                originalsOutOff: ko.observable(documentExisting[0].originals.substring(3, 2)),
                docType: documentExisting[0].docType
              });

            }
            else {
              self.docArray.push({
                docSelected: ko.observable(["false"]),
                id: productDetails.documents[i].id,
                clause: clause,
                copies: ko.observable(0),
                name: productDetails.documents[i].name,
                originals: ko.observable(0),
                originalsOutOff: ko.observable(0),
                docType: productDetails.documents[i].docType
              });
            }

          }

          self.showDocuments(true);
        }
      });
    }

    self.viewClauses = function (selectedDoc) {
      self.clausePushFlag = true;
      self.selectedClausesLength(selectedDoc.clause.length);

      for (i = 0; i < self.clauseTableArray().length; i++) {
        if (self.clauseTableArray()[i].docId === selectedDoc.id) {
          self.selectedClauses(self.clauseTableArray()[i]);
          self.clausePushFlag = false;
          break;
        }
      }

      if (self.clausePushFlag && selectedDoc.clause) {
        self.clauseTableArray.push({
          docId: selectedDoc.id,
          docName: params.baseModel.format(self.resourceBundle.labels.documentName, {
            docName: selectedDoc.name
          }),
          datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(selectedDoc.clause, {
            idAttribute: "rowId"
          }))
        });

        self.selectedClauses(self.clauseTableArray()[self.clauseTableArray().length - 1]);
      }

      if (!params.baseModel.large()) {
        self.clauseModalHeading(self.selectedClauses().docName);
        $("#documentClauses").trigger("openModal");
      }
    };

    self.goBack = function () {

      self.setMenuAsAmendment(true);

      const parameters = {
        mode: "VIEW",
        setMenuAsAmendment: self.setMenuAsAmendment(),
        letterOfCreditDetails: self.letterOfCreditDetails
      };

      params.dashboard.loadComponent("view-letter-of-credit", parameters);
    };

    self.getRowId = function (rowIndex) {
      return ++rowIndex;
    };

    self.chargesBorneByChangeHandler = function (event) {
      if (event.detail.value) {
        self.lcAmendmentDetails.chargesBorneBy(event.detail.value);
        self.lcAmendmentDetails.chargesFromBeneficiary(null);

        if (self.lcAmendmentDetails.chargesBorneBy() === self.chargesBorneByTypeOptions()[0].value) {
          self.showChargesAccount(true);
        }
        else {
          self.lcAmendmentDetails.chargingAccountId.value("");
          self.lcAmendmentDetails.chargingAccountId.displayValue("");
          self.showChargesAccount(false);
        }

      }
    };

    self.availableWithDetails = ko.observable(self.params.availableWithDetails);

  };

  vm.prototype.dispose = function () {
    self.shipmentRadioBtnSubscribe.dispose();
    self.beneSubscribe.dispose();
    self.requestedConfirmationPartyDetailsSubscribe.dispose();

    self.remainingDays.dispose();
    self.exposureAmount.dispose();
  };

  return vm;
});
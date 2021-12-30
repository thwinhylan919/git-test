define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/initiate-lc",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojradioset",
  "ojs/ojswitch"
], function (oj, ko, $, ReviewTradeFinanceModel, locale) {
  "use strict";

  return function (params) {
    let i;
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = locale;
    self.confirmScreenDetails = params.rootModel.confirmScreenDetails;
    params.baseModel.registerComponent("attach-documents", "trade-finance");
    self.documentPresentationDays = ko.observable(0);
    self.mode = ko.observable();
    self.datasourceForDraftReview = ko.observable();
    self.datasourceForDocReview = ko.observable();
    self.billingDraftsLoaded = ko.observable(false);
    self.documentsLoaded = ko.observable(false);
    self.autoReinstatement = ko.observable();
    self.clauseTableArrayForReview = [];
    self.clauseModalHeading = ko.observable();
    self.selectedClauses = ko.observable();
    self.beneName = ko.observable();
    self.datasourceForGoodsReview = ko.observable();
    self.goodsLists = ko.observableArray();
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.resourceBundle.heading.confirmLC;
    self.partialShipment = ko.observable(true);
    self.transShipment = ko.observable(true);

    self.requestedConfirmationPartyMode = self.params.requestedConfirmationPartyMode;
    self.confirmationInstructionOptions = self.params.confirmationInstructionOptions;
    self.requestedConfirmationPartyOptions = self.params.requestedConfirmationPartyOptions;
    self.requestedConfirmationPartyDetails = self.params.requestedConfirmationPartyDetails ? self.params.requestedConfirmationPartyDetails : ko.observable(null);
    self.confirmationInstructionDes = ko.observable();
    self.requestedConfirmationPartyDes = ko.observable();

    let countryList = [];

    function getCountryNameFromCode(countryCode) {
      const countryName = countryList.filter(function (data) {
        return data.code === countryCode;
      });

      return countryName.length > 0 ? countryName[0].description : null;
    }

    if (self.params.letterOfCreditDetails) {
      self.letterOfCreditDetails = self.params.letterOfCreditDetails;
    }

    self.confirmScreenExtensions = self.params.confirmScreenExtensions;

    self.beneAddress = {
      line1: ko.observable(),
      line2: ko.observable(),
      line3: ko.observable(),
      country: ko.observable()
    };

    self.reviewFlag = ko.observable(true);
    self.dataLoaded = ko.observable(false);
    self.additionalBankDetails = ko.observable();
    self.availableWithDetails = ko.observable();
    self.applicantName = ko.observable();

    self.applicantAddress = {
      line1: ko.observable(),
      line2: ko.observable(),
      line3: ko.observable(),
      country: ko.observable()
    };

    self.dropdownLabels = {
      country: ko.observable(),
      product: ko.observable(),
      branch: ko.observable(),
      incoterm: ko.observable()
    };

    self.docTblColumns = null;

    function shipment() {
      if (self.params.letterOfCreditDetails.shipmentDetails.partial === "" || self.params.letterOfCreditDetails.shipmentDetails.partial === null) {
        self.partialShipment(false);
      }

      if (self.params.letterOfCreditDetails.shipmentDetails.transShipment === "" || self.params.letterOfCreditDetails.shipmentDetails.transShipment === null) {
        self.transShipment(false);
      }
    }

    shipment();

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

    if (self.params.mode) {
      self.mode(self.params.mode);
    }

    if (self.params.dropdownLabels) {
      self.dropdownLabels = self.params.dropdownLabels;
    }

    if (self.mode() !== "approval") {
      params.dashboard.headerName(self.resourceBundle.heading.initiateLC);
    }

    self.fillconfirmScreenExtension = function () {
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
          value: self.letterOfCreditDetails.expiryDate
        }
        ]
      ];

      if (self.letterOfCreditDetails.swiftId !== null && self.letterOfCreditDetails.swiftId !== "") {
        confirmScreenDetailsArray.push([{
          label: self.resourceBundle.common.labels.amount,
          value: params.baseModel.formatCurrency(self.letterOfCreditDetails.amount.amount, self.letterOfCreditDetails.amount.currency)
        },
        {
          label: self.resourceBundle.instructionsDetails.labels.advBankSwiftCode,
          value: self.letterOfCreditDetails.swiftId
        }
        ]);
      } else {
        confirmScreenDetailsArray.push([{
          label: self.resourceBundle.common.labels.amount,
          value: params.baseModel.formatCurrency(self.letterOfCreditDetails.amount.amount, self.letterOfCreditDetails.amount.currency)
        }]);
      }

      if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); }
      else if (self.confirmScreenExtensions) {
        $.extend(self.confirmScreenExtensions, {
          isSet: true,
          taskCode: "TF_N_CLC",
          confirmScreenDetails: confirmScreenDetailsArray,
          template: "confirm-screen/trade-finance"
        });
      }
    };

    self.getDetails = function () {
      if (typeof self.letterOfCreditDetails !== "undefined") {
        self.multiGoodsSupported = self.params.multiGoodsSupported;
        self.beneAddress.country(self.dropdownLabels.country());

        if (self.letterOfCreditDetails.revolvingDetails.autoReinstatement === true) {
          self.autoReinstatement(["AUTOREINSTATEMENT"]);
        }
      } else {
        self.letterOfCreditDetails = ko.mapping.toJS(self.params.data);
        self.multiGoodsSupported = ko.observable(false);

        if (self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0) {
          self.multiGoodsSupported(true);
        }
      }

      if (self.letterOfCreditDetails.validBICCode) {

        self.creditAvailableWithSelected = ko.observable("SWIFTCODE");

      } else {
        self.creditAvailableWithSelected = ko.observable("BANKADDRESS");

      }

      if (self.letterOfCreditDetails.incoterm.code && self.letterOfCreditDetails.incoterm.code !== "") {
        const qQuery = { criteria: [] };

        qQuery.criteria.push({
          operand: "code",
          operator: "EQUALS",
          value: [self.letterOfCreditDetails.incoterm.code]
        });

        ReviewTradeFinanceModel.fetchIncoterm(JSON.stringify(qQuery)).done(function (data) {
          self.dropdownLabels.incoterm(data.incotermList[0].description);
        });
      }

      ReviewTradeFinanceModel.fetchBeniCountry().done(function (data) {
        const beneCountry = data.enumRepresentations[0].data.filter(function (data) {
          return data.code === self.letterOfCreditDetails.counterPartyAddress.country;
        });

        self.beneAddress.country(beneCountry[0].description);
      });

      ReviewTradeFinanceModel.fetchBranch().done(function (data) {
        const beneBranch = data.branchAddressDTO.filter(function (data) {
          return data.id === self.letterOfCreditDetails.branchId;
        });

        self.dropdownLabels.branch(beneBranch[0].branchName);
      });

      if (self.creditAvailableWithSelected() === "SWIFTCODE") {
        ReviewTradeFinanceModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith).done(function (data) {
          self.availableWithDetails(data);
        });
      }

      if (self.letterOfCreditDetails.swiftId && self.letterOfCreditDetails.swiftId !== null) {
        ReviewTradeFinanceModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId).done(function (data) {
          self.additionalBankDetails(data);
        });
      }

      Promise.all([ReviewTradeFinanceModel.fetchPartyDetails(self.letterOfCreditDetails.partyId.value),
      ReviewTradeFinanceModel.fetchProduct(self.letterOfCreditDetails.productId)
      ])
        .then(function (data) {
          const fetchPartyResponse = data[0],
            fetchProductResponse = data[1];

          self.applicantName(fetchPartyResponse.party.personalDetails.fullName);

          for (i = 0; i < fetchPartyResponse.party.addresses.length; i++) {
            if (fetchPartyResponse.party.addresses[i].type === "PST") {
              self.applicantAddress.line1(fetchPartyResponse.party.addresses[i].postalAddress.line1);
              self.applicantAddress.line2(fetchPartyResponse.party.addresses[i].postalAddress.line2);
              self.applicantAddress.line3(fetchPartyResponse.party.addresses[i].postalAddress.line3);
              self.applicantAddress.country(fetchPartyResponse.party.addresses[i].postalAddress.country);
            }
          }

          if (fetchProductResponse.letterOfCreditProductDTO) { self.dropdownLabels.product(fetchProductResponse.letterOfCreditProductDTO.name); }

          self.fillconfirmScreenExtension();
        });

      if (self.multiGoodsSupported()) {
        self.multiGoodsSupported(true);
      } else {
        self.multiGoodsSupported(false);
      }

      if (self.requestedConfirmationPartyDetails() === null && self.params.confirmationInstructionBankCode && self.params.confirmationInstructionBankCode()) {

        ReviewTradeFinanceModel.getBankDetailsBIC(self.params.confirmationInstructionBankCode()).done(function (data) {
          ReviewTradeFinanceModel.fetchBeniCountry().done(function (countryData) {
            countryList = countryData.enumRepresentations[0].data;
            data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
            self.letterOfCreditDetails.requestedConfirmationPartyDetails = ko.mapping.fromJS(data);
            self.requestedConfirmationPartyDetails(data);
            delete self.requestedConfirmationPartyDetails().status;
            delete self.letterOfCreditDetails.requestedConfirmationPartyDetails.status;
            ko.tasks.runEarly();
          });

        });
      }

      self.dataLoaded(true);
    };

    self.getDetails();

    function initConfirmationInstructionDesc() {
      self.confirmationInstructionDes(params.baseModel.getDescriptionFromCode(self.confirmationInstructionOptions(), self.letterOfCreditDetails.confirmationInstruction, "value", "label"));
      self.requestedConfirmationPartyDes(params.baseModel.getDescriptionFromCode(self.requestedConfirmationPartyOptions(), self.letterOfCreditDetails.requestedConfirmationParty, "value", "label"));
    }

    function setConfirmationOptions() {
      ReviewTradeFinanceModel.fetchConfirmationParty().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.requestedConfirmationPartyOptions.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }

        ReviewTradeFinanceModel.fetchConfirmationInstruction().done(function (data) {
          for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.confirmationInstructionOptions.push({
              value: data.enumRepresentations[0].data[i].code,
              label: data.enumRepresentations[0].data[i].description
            });
          }

          initConfirmationInstructionDesc();
        });
      });
    }

    if (self.mode() === "approval") {
      self.confirmationInstructionOptions = ko.observableArray();
      self.requestedConfirmationPartyOptions = ko.observableArray();

      if (self.requestedConfirmationPartyOptions && self.requestedConfirmationPartyOptions().length === 0) {
        setConfirmationOptions();
      } else {
        initConfirmationInstructionDesc();
      }
    }

    self.attachedDocuments = ko.observable(self.letterOfCreditDetails.attachedDocuments);

    if (self.letterOfCreditDetails.documentPresentationDays && self.letterOfCreditDetails.documentPresentationDays !== null) {
      self.documentPresentationDays(self.letterOfCreditDetails.documentPresentationDays);
    }

    self.beneName(self.letterOfCreditDetails.counterPartyName);
    self.beneAddress.line1(self.letterOfCreditDetails.counterPartyAddress.line1);
    self.beneAddress.line2(self.letterOfCreditDetails.counterPartyAddress.line2);
    self.beneAddress.line3(self.letterOfCreditDetails.counterPartyAddress.line3);

    if (self.letterOfCreditDetails.draftsRequired.toString() === "true" && self.letterOfCreditDetails.billingDrafts && self.letterOfCreditDetails.billingDrafts.length > 0) {
      self.datasourceForDraftReview = new oj.ArrayTableDataSource(self.letterOfCreditDetails.billingDrafts);
      self.billingDraftsLoaded(true);
    }

    if (self.multiGoodsSupported() && self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods.length > 0) {
      self.goodsLists.removeAll();

      for (i = 0; i < self.letterOfCreditDetails.goods.length; i++) {
        self.goodsLists.push({
          code: self.letterOfCreditDetails.goods[i].code,
          description: self.letterOfCreditDetails.goods[i].description,
          noOfUnits: self.letterOfCreditDetails.goods[i].noOfUnits ? self.letterOfCreditDetails.goods[i].noOfUnits : "",
          pricePerUnit: self.letterOfCreditDetails.goods[i].pricePerUnit ? self.letterOfCreditDetails.goods[i].pricePerUnit : ""
        });
      }

      self.datasourceForGoodsReview = new oj.ArrayTableDataSource(self.goodsLists());
    } else {
      self.datasourceForGoodsReview = new oj.ArrayTableDataSource([]);
    }

    if (self.letterOfCreditDetails.document && self.letterOfCreditDetails.document.length > 0) {
      self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.letterOfCreditDetails.document, {
        idAttribute: "id"
      }));

      for (i = 0; i < self.letterOfCreditDetails.document.length; i++) {
        if (self.letterOfCreditDetails.document[i].clause && self.letterOfCreditDetails.document[i].clause.length > 0) {
          self.clauseTableArrayForReview.push({
            docId: self.letterOfCreditDetails.document[i].id,
            docName: params.baseModel.format(self.resourceBundle.labels.documentName, {
              docName: self.letterOfCreditDetails.document[i].name
            }),
            datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.letterOfCreditDetails.document[i].clause))
          });
        }
      }

      self.documentsLoaded(true);
    }

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

    self.stages = [{
      stageName: self.resourceBundle.heading.lcDetails,
      templateName: "trade-finance/lc-details"
    },
    {
      stageName: self.resourceBundle.heading.shipmentDetails,
      templateName: "trade-finance/shipment-details"
    },
    {
      stageName: self.resourceBundle.heading.documents,
      templateName: "trade-finance/document-details"
    },
    {
      stageName: self.resourceBundle.heading.instructions,
      templateName: "trade-finance/instructions-details"
    },
    {
      stageName: self.resourceBundle.heading.attachments,
      templateName: "attach-documents"
    }
    ];

    self.editAll = function () {
      const parameters = {
        mode: "EDIT",
        letterOfCreditDetails: ko.mapping.toJS(self.letterOfCreditDetails),
        requestedConfirmationPartyDetails: self.requestedConfirmationPartyDetails,
        transactionType: self.transactionType
      };

      params.dashboard.loadComponent("initiate-lc", parameters);
    };

    self.getRowId = function (rowIndex) {
      return ++rowIndex;
    };

    self.confirm = function () {
      let payload, hostReferenceNumber = null;

      if (self.letterOfCreditDetails.confirmationInstruction === "WITHOUT") {
        self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;
      } else if ((self.requestedConfirmationPartyDetails() && self.requestedConfirmationPartyDetails().code) || (self.letterOfCreditDetails.requestedConfirmationParty === "ABK")) {
        self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;

        if (self.letterOfCreditDetails.requestedConfirmationParty === "ATB") {
          self.letterOfCreditDetails.advisingThroughBankCode = self.requestedConfirmationPartyDetails().code;
        }
        else if (self.letterOfCreditDetails.requestedConfirmationParty === "COB") {
          self.letterOfCreditDetails.confirmingBankCode = self.requestedConfirmationPartyDetails().code;
        }
      }

      if (self.letterOfCreditDetails.revolving === "false") {
        payload = ko.mapping.toJSON(self.letterOfCreditDetails, { ignore: ["revolvingDetails"] });
      }
      else {
        payload = ko.mapping.toJSON(self.letterOfCreditDetails);
      }

      ReviewTradeFinanceModel.initiateLC(payload).done(function (data, status, jqXhr) {
        if (data.letterOfCredit && data.letterOfCredit.applicationNumber) {
          hostReferenceNumber = data.letterOfCredit.applicationNumber;
        }
        else if (data.letterOfCredit && data.letterOfCredit.id) {
          hostReferenceNumber = data.letterOfCredit.id;
        } else {
          hostReferenceNumber = null;
        }

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          hostReferenceNumber: hostReferenceNumber,
          transactionName: self.resourceBundle.heading.initiateLC,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TF_N_CLC",
            confirmScreenDetails: self.confirmScreenDetails,
            template: "confirm-screen/trade-finance"
          }
        });
      });
    };
  };
});

define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/view-guarantee",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojnavigationlist",
  "ojs/ojdatetimepicker",
  "ojs/ojconveyorbelt",
  "ojs/ojradioset",
  "ojs/ojswitch",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol"
], function (oj, ko, $, ViewBGModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);

    let chargesLength, commissionLength, i;

    self.backView = ko.observable(false);
    self.resourceBundle = resourceBundle;
    self.guaranteeDetails = self.params.guaranteeDetails;
    self.mode = ko.observable("VIEW");
    self.dataLoaded = ko.observable(false);
    self.sectionName = ko.observable(self.resourceBundle.leftMenu.viewBGDetails);
    self.applicantName = ko.observable();
    self.additionalBankDetails = ko.observable();

    let countryList = [];

    self.amendments = ko.observableArray();
    self.dataForAmendment = ko.observable();
    self.chargesDetailsLoaded = ko.observable(false);
    self.contractsLoaded = ko.observable(false);
    self.adviceList = ko.observableArray();
    self.datasourceForAdvices = ko.observable();
    self.swiftList = ko.observableArray();
    self.datasourceForSwift = ko.observable();
    self.contractList = ko.observableArray();
    self.datasourceForContractReview = ko.observableArray();
    self.commisionList = ko.observableArray();
    self.commissionDataSource = ko.observable();
    self.chargesList = ko.observableArray();
    self.chargesDataSource = ko.observable();
    self.amendmentId = ko.observable();
    self.amendmentDetailsLoaded = ko.observable(false);
    self.amendmentDetails = ko.observable();
    self.bgAmendValuesLoaded = ko.observable(false);
    self.bgAmendValues = ko.observable();
    self.reviewDataLoaded = ko.observable(false);
    self.contractModified = ko.observable(false);
    self.deletedDocuments = ko.observableArray();
    self.advisingBankDescription = ko.observable();

    self.applicantAddress = {
      line1: ko.observable(),
      line2: ko.observable(),
      line3: ko.observable(),
      country: ko.observable()
    };

    self.menuSelection = ko.observable();
    self.menuOptions = ko.observableArray();

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.menuOptions([{
      id: "main",
      label: self.resourceBundle.leftMenu.viewBGDetails,
      templatePath: self.resourceBundle.leftMenu.viewBGDetails
    },
    {
      id: "ammendments",
      label: self.resourceBundle.leftMenu.amendments,
      templatePath: "trade-finance/view-guarantees/bank-guarantee-amendments"
    },
    {
      id: "charges",
      label: self.resourceBundle.leftMenu.charges,
      templatePath: "trade-finance/view-guarantees/bank-guarantee-charges"
    },
    {
      id: "viewSwiftMessages",
      label: self.resourceBundle.leftMenu.viewSwiftMessages,
      templatePath: "trade-finance/swift-message"
    },
    {
      id: "viewAdvice",
      label: self.resourceBundle.leftMenu.viewAdvice,
      templatePath: "trade-finance/advices"
    }
    ]);

    function getCountryNameFromCode(countryCode) {
      const countryName = countryList.filter(function (data) {
        return data.code === countryCode;
      });

      return countryName.length > 0 ? countryName[0].description : null;
    }

    self.menuSelection("main");
    self.chargesOrCommissionSelection = ko.observable("COMMISION");
    self.chargesCommissionFlag = ko.observable("false");
    params.baseModel.registerComponent("review-amendment", "guarantee");
    params.baseModel.registerComponent("amend-bank-guarantee", "guarantee");
    params.baseModel.registerComponent("outward-guarantees", "guarantee");
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerElement("floating-panel");
    params.baseModel.registerElement("nav-bar");

    self.adviceDetails = {
      message: ko.observable(),
      eventDesc: ko.observable(),
      eventDate: ko.observable(),
      description: ko.observable(),
      dcnNo: ko.observable()
    };

    self.swiftDetails = {
      message: ko.observable(),
      eventDesc: ko.observable(),
      eventDate: ko.observable(),
      description: ko.observable(),
      dcnNo: ko.observable()
    };

    let guaranteeDetailsStageName;

    if (self.params.guaranteeTransactionType === "OUTWARD") {
      params.dashboard.headerName(self.resourceBundle.heading.outwardGuarantee);
      guaranteeDetailsStageName = self.resourceBundle.heading.outwardguaranteeDetails;
    } else {
      params.dashboard.headerName(self.resourceBundle.heading.inwardGuarantee);
      guaranteeDetailsStageName = self.resourceBundle.heading.inwardguaranteeDetails;
    }

    self.stages = [{
      stageName: guaranteeDetailsStageName,
      expanded: ko.observable(true),
      templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-parties")
    },
    {
      stageName: self.resourceBundle.heading.commitmentDetails,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-commitment")
    },
    {
      stageName: self.resourceBundle.heading.bankInstructions,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-instructions")
    },
    {
      stageName: self.resourceBundle.heading.guarantee,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-contracts")
    }
    ];

    self.dropdownLabels = {
      branch: ko.observable(),
      country: ko.observable(),
      product: ko.observable(),
      guaranteeType: ko.observable()
    };

    const getNewKoModel = function () {
      const KoModel = ViewBGModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.rootModelInstance = ko.observable(getNewKoModel());
    self.modifyContractPayload = self.rootModelInstance().ModifyContractModel;

    self.totalCommissionLabelFunc = function (context) {
      if (commissionLength > 0) {
        const parentElement = $(context.footerContext.parentElement);

        parentElement.append(self.resourceBundle.labels.totalCommission);
      }
    };

    self.initiateAmend = function () {
      const parameters = {
        mode: "CREATE",
        guaranteeDetails: ko.mapping.toJS(self.guaranteeDetails),
        dropdownLabels: ko.mapping.toJS(self.dropdownLabels),
        applicantAddress: ko.mapping.toJS(self.applicantAddress),
        guaranteeTransactionType: self.params.guaranteeTransactionType
      };

      params.dashboard.loadComponent("amend-bank-guarantee", parameters);
    };

    self.totalLabelFunc = function (context) {
      if (chargesLength > 0) {
        const parentElement = $(context.footerContext.parentElement);

        parentElement.append(self.resourceBundle.labels.totalCharges);
      }
    };

    self.totalFunc = function (context) {
      const datasource = context.footerContext.datasource;

      if (!datasource) {
        return;
      }

      let total = 0;
      const totalRowCount = datasource.totalSize();
      let currency;
      const addAmount = function (rowNum) {
        datasource.at(rowNum).then(function (row) {
          currency = row.data.amount.currency;
          total = total + parseFloat(row.data.amount.amount);

          if (rowNum < totalRowCount - 1) {
            addAmount(rowNum + 1);
          } else {
            const parentElement = $(context.footerContext.parentElement);

            parentElement.append(params.baseModel.formatCurrency(total, currency));
          }
        });
      };

      if (datasource.data.length > 0) {
        addAmount(0);
      }
    };

    self.openAdviceDetails = function (dcnNo) {
      ViewBGModel.getAdviceDetails(self.guaranteeDetails.bgId, dcnNo).done(function (data) {
        self.adviceDetails.dcnNo(data.adviceDTO.dcnNo);
        self.adviceDetails.message(data.adviceDTO.message);
        self.adviceDetails.eventDesc(data.adviceDTO.eventDesc);
        self.adviceDetails.eventDate(data.adviceDTO.eventDate);
        $("#adviceDialog").trigger("openModal");
      });
    };

    self.openSwiftDetails = function (dcnNo) {
      ViewBGModel.getSwiftDetails(self.guaranteeDetails.bgId, dcnNo).done(function (data) {
        self.swiftDetails.dcnNo(data.swiftMessageDTO.dcnNo);
        self.swiftDetails.message(data.swiftMessageDTO.message);
        self.swiftDetails.eventDesc(data.swiftMessageDTO.eventDesc);
        self.swiftDetails.eventDate(data.swiftMessageDTO.eventDate);
        $("#swiftDialog").trigger("openModal");
      });
    };

    function fetchAmendments() {
      ViewBGModel.getAmendments(self.guaranteeDetails.bgId).done(function (data) {
        self.amendments(data.bankGuaranteeAmendmentDTOs);

        if (self.amendments()) {
          self.dataForAmendment(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.amendments(), {
            idAttribute: "id"
          })));
        }
      });
    }

    self.fetchAmendmentDetails = function (amendmentId) {
      ViewBGModel.getAmendmentDetails(self.guaranteeDetails.bgId, amendmentId).done(function (data) {
        const parameters = {
          mode: "VIEW",
          data: ko.mapping.fromJS(data.bankGuaranteeAmendment),
          guaranteeTransactionType: self.params.guaranteeTransactionType
        };

        self.reviewDataLoaded(true);
        params.dashboard.loadComponent("review-amendment", parameters);
      });
    };

    function fetchBGCharges() {
      ViewBGModel.getChargesDetails(self.guaranteeDetails.bgId).done(function (data) {
        self.chargesDetailsLoaded(false);
        chargesLength = data.bankGuaranteeChargesDTOs[0].charges.length;
        commissionLength = data.bankGuaranteeChargesDTOs[0].commissions ? data.bankGuaranteeChargesDTOs[0].commissions.length : 0;

        if (commissionLength > 0) {
          self.commisionList(data.bankGuaranteeChargesDTOs[0].commissions);
          self.commissionDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.commisionList())));
        } else {
          self.commissionDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
        }

        if (chargesLength > 0) {
          self.chargesList(data.bankGuaranteeChargesDTOs[0].charges);

          self.chargesDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.chargesList(), {
            idAttribute: "chargesForAmendment"
          })));
        }

        self.chargesDetailsLoaded(true);
      });
    }

    self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
      const menuOption = self.menuOptions().filter(function (data) {
        return data.id === newValue;
      });

      self.showSection(menuOption[0].data, menuOption[0].templatePath);
    });

    self.showSection = function (sectionName, templatePath) {
      if (params.baseModel.small()) {
        document.querySelector("#panelDD").dispatchEvent(new CustomEvent("closeFloatingPanel"));
      }

      switch (sectionName) {
        case self.resourceBundle.leftMenu.viewBGDetails:
          if (params.baseModel.small() === true) {
            self.chargesCommissionFlag("false");
            params.dashboard.headerName(self.resourceBundle.heading.guaranteeDetails);
          }

          break;
        case self.resourceBundle.leftMenu.amendments:
          if (params.baseModel.small() === true) {
            self.chargesCommissionFlag("false");
            params.dashboard.headerName(self.resourceBundle.leftMenu.amendments);
          }

          fetchAmendments();
          break;
        case self.resourceBundle.leftMenu.charges:
          if (params.baseModel.small() === true) {
            self.chargesCommissionFlag("true");
            params.dashboard.headerName(self.resourceBundle.leftMenu.charges);
          }

          fetchBGCharges();
          break;
        case self.resourceBundle.leftMenu.viewSwiftMessages:
          if (params.baseModel.small() === true) {
            self.chargesCommissionFlag("false");
            params.dashboard.headerName(self.resourceBundle.leftMenu.viewSwiftMessages);
          }

          break;
        case self.resourceBundle.leftMenu.viewAdvice:
          if (params.baseModel.small() === true) {
            self.chargesCommissionFlag("false");
            params.dashboard.headerName(self.resourceBundle.leftMenu.viewAdvice);
          }

          break;
      }

      self.sectionName(templatePath);
    };

    self.saveSwiftDetails = function () {
      ViewBGModel.fetchSwiftPDF(self.guaranteeDetails.bgId, self.swiftDetails.dcnNo());
    };

    self.saveAdvice = function () {
      ViewBGModel.fetchAdvicePDF(self.guaranteeDetails.bgId, self.adviceDetails.dcnNo());
    };

    if (self.guaranteeDetails) {
      self.contractList(self.guaranteeDetails.bankGuaranteeContract);

      if (self.contractList()) {
        self.datasourceForContractReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.contractList(), {
          idAttribute: "contractId"
        })));
      }

      self.contractsLoaded(true);
      self.dropdownLabels.product(self.guaranteeDetails.productName);
      self.adviceList(self.guaranteeDetails.advices);

      if (self.adviceList()) {
        self.datasourceForAdvices(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.adviceList(), {
          idAttribute: "dcnNo"
        })));
      }

      self.swiftList(self.guaranteeDetails.swiftMessages);

      if (self.swiftList()) {
        self.datasourceForSwift(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.swiftList(), {
          idAttribute: "dcnNo"
        })));
      }

      ViewBGModel.fetchBranch().done(function (data) {
        const beneBranch = data.branchAddressDTO.filter(function (data) {
          return data.id === self.guaranteeDetails.branchId;
        });

        self.dropdownLabels.branch(beneBranch[0].branchName);
      });

      ViewBGModel.fetchGuranteeType().done(function (typeData) {
        const guaranteeType = typeData.bankGuaranteeTypeDTO.filter(function (typeData) {
          return typeData.code === self.guaranteeDetails.guaranteetype;
        });

        self.dropdownLabels.guaranteeType(guaranteeType[0].description);
      });

      ViewBGModel.fetchPartyDetails(self.guaranteeDetails.partyId.value).done(function (data) {
        self.applicantName(data.party.personalDetails.fullName);

        for (let i = 0; i < data.party.addresses.length; i++) {
          if (data.party.addresses[i].type === "PST") {
            self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
            self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
            self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);
            self.applicantAddress.country(data.party.addresses[i].postalAddress.country);
          }
        }
      });

      ViewBGModel.fetchBeniCountry().done(function (data) {
        countryList = data.enumRepresentations[0].data;

        const beneCountry = countryList.filter(function (data) {
          return data.code === self.guaranteeDetails.beneAddress.country;

        });

        self.dropdownLabels.country(beneCountry[0].description);
      });

      if (self.guaranteeDetails.advisingBankCode && self.guaranteeDetails.advisingBankCode !== null) {
        ViewBGModel.getBankDetailsBIC(self.guaranteeDetails.advisingBankCode).done(function (data) {
          data.branchAddress.country = getCountryNameFromCode(data.branchAddress.country);
          self.additionalBankDetails(data);
        });
      }

      self.dataLoaded(true);
    }

    self.modifyContract = function () {
      self.modifyContractPayload.deletedDocuments(self.deletedDocuments());
      self.modifyContractPayload.beneName(self.guaranteeDetails.beneName);
      self.modifyContractPayload.contractAmount.amount(self.guaranteeDetails.contractAmount.amount);
      self.modifyContractPayload.contractAmount.currency(self.guaranteeDetails.contractAmount.currency);

      ViewBGModel.modifyContract(self.guaranteeDetails.bgId, ko.mapping.toJSON(self.modifyContractPayload)).done(function (data, status, jqXhr) {
        let hostReferenceNumber = null;

        if (data.bankGuarantee) {
          hostReferenceNumber = data.bankGuarantee.bgId;
        }

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          hostReferenceNumber: hostReferenceNumber,
          transactionName: self.resourceBundle.labels.docForGuarantee,
          template: "confirm-screen/trade-finance"
        });
      });
    };

    self.totalCharges = function () {
      const chargesRowCount = self.chargesList().length;

      if (chargesRowCount > 0) {
        let chargesTotal = 0,
          chargesCurrency;

        for (i = 0; i < chargesRowCount; i++) {
          chargesCurrency = self.chargesList()[i].amount.currency;
          chargesTotal = chargesTotal + parseFloat(self.chargesList()[i].amount.amount);
        }

        const chargesTotalAmount = params.baseModel.formatCurrency(chargesTotal, chargesCurrency);

        return chargesTotalAmount;
      }
    };

    self.totalCommision = function () {
      const commissionRowCount = self.commisionList().length;

      if (commissionRowCount > 0) {
        let commissionTotal = 0,
          commissionCurrency;

        for (i = 0; i < commissionRowCount; i++) {
          commissionCurrency = self.commisionList()[i].amount.currency;
          commissionTotal = commissionTotal + parseFloat(self.commisionList()[i].amount.amount);
        }

        const commissionTotalAmount = params.baseModel.formatCurrency(commissionTotal, commissionCurrency);

        return commissionTotalAmount;
      }
    };

    self.hideWarningContainer = function () {
      $("#warning-container").fadeOut("slow");
    };

    self.getRowId = function (rowIndex) {
      return ++rowIndex;
    };

    self.goBack = function () {
      self.backView(true);

      const parameters = {
        mode: "VIEW",
        backView: self.backView,
        applicantName: params.rootModel.params.applicantName ? params.rootModel.params.applicantName : ko.observable(),
        beneName: params.rootModel.params.beneName ? params.rootModel.params.beneName : ko.observable(),
        bgNumber: params.rootModel.params.bgNumber ? params.rootModel.params.bgNumber : ko.observable(),
        bgStatus: params.rootModel.params.bgStatus ? params.rootModel.params.bgStatus : ko.observable(),
        fromAmount: params.rootModel.params.fromAmount ? params.rootModel.params.fromAmount : ko.observable(),
        toAmount: params.rootModel.params.toAmount ? params.rootModel.params.toAmount : ko.observable(),
        issueDatefrom: params.rootModel.params.issueDatefrom ? params.rootModel.params.issueDatefrom : ko.observable(),
        issueDateto: params.rootModel.params.issueDateto ? params.rootModel.params.issueDateto : ko.observable()
      };

      if (self.params.guaranteeTransactionType === "OUTWARD") {
        params.dashboard.loadComponent("outward-guarantees", parameters);
      }
      else {
        params.dashboard.loadComponent("inward-guarantees", parameters);
      }
    };

    self.showFloatingPanel = function () {
      $("#panelDD")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };
  };

  vm.prototype.dispose = function () {
    this.menuSelectionSubscribe.dispose();
  };

  return vm;
});

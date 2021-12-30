define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/view-guarantee",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojvalidation",
  "ojs/ojtable",
  "ojs/ojvalidationgroup",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojnavigationlist",
  "ojs/ojdatetimepicker",
  "ojs/ojconveyorbelt",
  "ojs/ojpagingcontrol",
  "ojs/ojcheckboxset",
  "ojs/ojknockout-validation",
  "ojs/ojswitch"
], function (oj, ko, $, AmendBGModel, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.mode = ko.observable(self.params.mode);
    self.minClosureDate = ko.observable();
    self.tncValue = ko.observable([]);
    self.sectionHeading = ko.observable();
    self.contractList = ko.observableArray();
    self.termsAndConditionsListArray = ko.observableArray();
    self.datasourceForContractReview = ko.observableArray();
    self.datasourceForTermsAndConditionsReview = ko.observable();
    self.commitmentValidationTracker = ko.observable();
    self.tncValidationTracker = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.reviewDataLoaded = ko.observable(false);
    self.checkIfBGDetailsLoaded = ko.observable(false);
    self.guaranteeDetails = self.params.guaranteeDetails;
    self.dropdownLabels = self.params.dropdownLabels;
    self.applicantAddress = self.params.applicantAddress;
    self.bgAmendmentDetails = ko.mapping.fromJS(self.params.bgAmendmentDetails);
    self.setMenuAsAmendment = ko.observable(false);

    let guaranteeDetailsStageName;

    if (self.params.guaranteeTransactionType === "OUTWARD") {
      params.dashboard.headerName(self.resourceBundle.heading.initiateOutwardBGAmendment);
      guaranteeDetailsStageName = self.resourceBundle.heading.outwardguaranteeDetails;
    }
    else {
      params.dashboard.headerName(self.resourceBundle.heading.initiateInwardBGAmendment);
      guaranteeDetailsStageName = self.resourceBundle.heading.inwardguaranteeDetails;
    }

    self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, {
      bgNumber: self.guaranteeDetails.bgId
    }));

    self.currencyListOptions = ko.observableArray();
    self.isExpiryDateChanged = ko.observable(false);
    self.isClosureDateChanged = ko.observable(false);
    self.expiryDateMinusOne = ko.observable();
    self.closureDateMinusOne = ko.observable();
    self.minEffectiveDate = ko.observable();
    self.effectiveDate1 = ko.observable();
    self.termsAndCondsDataSourceLoaded = ko.observable(true);
    self.effectiveDate2 = ko.observable();
    self.minExpiryDate = ko.observable();
    self.claimDays = ko.observable();
    self.tncGroupValid = ko.observable();
    self.amendCommitmentTracker = ko.observable();
    self.validityType = self.guaranteeDetails.validityType === "UNLIMITED" ? ko.observable(true) : ko.observable(false);

    if (self.guaranteeDetails.effectiveDate !== null) {
      const date = new Date(self.guaranteeDetails.effectiveDate);

      date.setDate(date.getDate() + 1);
      self.effectiveDate1(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
      date.setDate(date.getDate() + 1);
      self.effectiveDate2(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
    }

    AmendBGModel.fetchBranchDate(self.guaranteeDetails.branchId).done(function (res) {
      const date = new Date(res.branchDate);

      date.setDate(date.getDate() + 1);
      self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
      date.setDate(date.getDate() + 1);
      self.minExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
    });

    const getNewKoModel = function () {
      const KoModel = AmendBGModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.validityTypeChangedHandler = function () {
      if (!self.validityType()) {
        if (self.bgAmendmentDetails.expiryCondition()) {
          self.bgAmendmentDetails.expiryCondition("");
        }
      }
    };

    self.addTermsAndConditions = function () {
      self.termsAndConditionsListArray.push({
        srNo: self.termsAndConditionsListArray().length + 1,
        undertakingType: ko.observable(""),
        description: ko.observable("")
      });
    };

    function findIndexInData(data, value) {
      for (let i = 0; i < data.length; i++) {
        if (ko.utils.unwrapObservable(data[i].srNo) === value) {
          return i;
        }
      }

      return -1;
    }

    self.remove = function (data) {
      self.termsAndCondsDataSourceLoaded(false);

      const index = findIndexInData(self.termsAndConditionsListArray(), ko.utils.unwrapObservable(data.srNo));

      self.termsAndConditionsListArray.splice(index, 1);
      self.termsAndCondsDataSourceLoaded(true);
    };

    params.baseModel.registerComponent("review-amendment", "guarantee");

    self.amendStages = [{
      stageName: guaranteeDetailsStageName,
      expanded: ko.observable(true),
      templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-parties"),
      editable: false,
      validated: ko.observable()
    },
    {
      stageName: self.resourceBundle.heading.commitmentDetails,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/view-guarantees/amend-commitment-details"),
      editable: true,
      validated: ko.observable()
    },
    {
      stageName: self.resourceBundle.heading.bankInstructions,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-instructions"),
      editable: false,
      validated: ko.observable()
    },
    {
      stageName: self.resourceBundle.heading.guarantee,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-contracts"),
      editable: false,
      validated: ko.observable()
    },
    {
      stageName: self.resourceBundle.heading.termsAndConditions,
      expanded: ko.observable(false),
      templateName: ko.observable("trade-finance/view-guarantees/amend-terms-and-conditions"),
      editable: false,
      validated: ko.observable()
    }
    ];

    self.contractList(self.guaranteeDetails.bankGuaranteeContract);

    if (self.contractList()) {
      self.datasourceForContractReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.contractList(), {
        idAttribute: "contractId"
      })));
    }

    if (!self.params.termsAndConditionsListArray) {
      if (self.guaranteeDetails.termsAndConditions && self.guaranteeDetails.termsAndConditions.length > 0) {
        for (let i = 0; i < self.guaranteeDetails.termsAndConditions.length; i++) {
          self.termsAndConditionsListArray.push({
            srNo: i + 1,
            undertakingType: self.resourceBundle.termsAndConditions.labels.guarantee,
            description: ko.observable(self.guaranteeDetails.termsAndConditions[i].description)
          });
        }
      }
      else {
        self.termsAndConditionsListArray.push({
          srNo: 1,
          undertakingType: self.resourceBundle.termsAndConditions.labels.guarantee,
          description: ko.observable("")
        });
      }
    }
    else {
      self.termsAndConditionsListArray = self.params.termsAndConditionsListArray;
    }

    self.datasourceForTermsAndConditionsReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.termsAndConditionsListArray, {
      idAttribute: "srNo"
    })));

    function loadDataIntoModel() {
      self.bgAmendmentDetails.bgId(self.guaranteeDetails.bgId);
      self.bgAmendmentDetails.issueDate(self.guaranteeDetails.issueDate);
      self.bgAmendmentDetails.partyId.displayValue(self.guaranteeDetails.partyId.displayValue);
      self.bgAmendmentDetails.partyId.value(self.guaranteeDetails.partyId.value);
      self.bgAmendmentDetails.newAmount.amount(self.guaranteeDetails.contractAmount.amount);
      self.bgAmendmentDetails.newAmount.currency(self.guaranteeDetails.contractAmount.currency);
      self.bgAmendmentDetails.newExpiryDate(self.guaranteeDetails.expiryDate);
      self.bgAmendmentDetails.newClosureDate(self.guaranteeDetails.closureDate);
      self.bgAmendmentDetails.validityType(self.validityType() ? "UNLIMITED" : "LIMITED");
      self.bgAmendmentDetails.expiryCondition(self.guaranteeDetails.expiryCondition);
      self.dataLoaded(true);
    }

    if (self.mode() === "CREATE") {
      self.rootModelInstance = ko.observable(getNewKoModel());
      self.bgAmendmentDetails = self.rootModelInstance().AmendedBGDetails;
      loadDataIntoModel();
    } else {
      self.dataLoaded(true);
    }

    self.validateGuaranteeAmount = {
      validate: function (value) {
        if (value) {
          if (value <= 0) {
            throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.invalidAmountErrorMessage);
          }

          const numberfractional1 = value.toString().split(".");

          if (numberfractional1[0]) {
            if (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0])) {
              throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.bgAmountError);
            }
          }

          if (numberfractional1[1]) {
            if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
              throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.bgAmountError);
            }
          }
        }

        return true;
      }
    };

    self.newExpiryDateSubscribe = self.bgAmendmentDetails.newExpiryDate.subscribe(function (newValue) {
      AmendBGModel.fetchProductDetails(self.guaranteeDetails.productId).done(function (productData) {
        const date = new Date(newValue);

        self.claimDays(productData.bankGuaranteeProductDTO.claimDays);

        if (self.claimDays()) {
          date.setDate(date.getDate() + self.claimDays());
        } else {
          date.setDate(date.getDate() + 1);
        }

        const date2 = new Date(newValue);

        date2.setDate(date2.getDate() - 1);
        self.minClosureDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
        self.expiryDateMinusOne(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
      });
    });

    self.newClosureDateSubscribe = self.bgAmendmentDetails.newClosureDate.subscribe(function (newValue) {
      const date2 = new Date(newValue);

      date2.setDate(date2.getDate() - 1);
      self.closureDateMinusOne(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
    });

    self.termsAndConditions = function () {
      $("#tncDialog").trigger("openModal");
    };

    self.goBack = function () {
      self.setMenuAsAmendment(true);

      const parameters = {
        mode: "VIEW",
        setMenuAsAmendment: self.setMenuAsAmendment(),
        guaranteeDetails: self.guaranteeDetails,
        guaranteeTransactionType: self.params.guaranteeTransactionType
      };

      params.dashboard.loadComponent("view-bank-guarantee", parameters);
    };

    function validate() {
      let validationFlag = true;
      const amendCommitmentTracker = document.getElementById("amendCommitmentTracker");

      if (amendCommitmentTracker.valid === "valid") {
        self.amendStages[1].validated(true);
      } else {
        self.amendStages[1].validated(false);
        validationFlag = false;
        amendCommitmentTracker.showMessages();
        amendCommitmentTracker.focusOn("@firstInvalidShown");
      }

      const tncTracker = document.getElementById("tncTracker");

      if (tncTracker.valid !== "valid") {
        validationFlag = false;
        tncTracker.showMessages();
        tncTracker.focusOn("@firstInvalidShown");
      }

      return validationFlag;
    }

    self.amendBG = function () {
      if (validate()) {
        self.bgAmendmentDetails.validityType(self.validityType() ? "UNLIMITED" : "LIMITED");

        self.bgAmendmentDetails.termsAndConditions.removeAll();

        for (let i = 0; i < self.termsAndConditionsListArray().length; i++) {
          self.bgAmendmentDetails.termsAndConditions.push({
            serialNo: (i + 1).toString(),
            undertakingType: "GUARANTEE",
            description: self.termsAndConditionsListArray()[i].description
          });
        }

        if (self.params.guaranteeTransactionType === "OUTWARD") {
          self.bgAmendmentDetails.transactionType("OUTWARD");
        } else {
          self.bgAmendmentDetails.transactionType("INWARD");
        }

        const parameters = {
          mode: "REVIEW",
          data: self.bgAmendmentDetails
        };

        self.checkIfBGDetailsLoaded(true);
        params.dashboard.loadComponent("review-amendment", parameters);
      }
    };
  };

  self.close = function () {
    $("#tncDialog").hide();
  };

  vm.prototype.dispose = function () {
    this.newExpiryDateSubscribe.dispose();
    this.newClosureDateSubscribe.dispose();
  };

  return vm;
});
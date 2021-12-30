define([

  "knockout",
  "jquery",
  "./model",
  "load!./purposes.json",
  "ojL10n!resources/nls/requirements",
  "ojs/ojselectcombobox",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojvalidationgroup"
], function(ko, $, RequirementsModel, jsonData, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let i;
    const getNewKoModel = function(currency) {
      const KoModel = RequirementsModel.getNewModel(currency);

      return KoModel;
    };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.loanPurposeLoaded = ko.observable(false);
    self.downPaymentRequired = ko.observable("OPTION_NO");
    self.disableSubmit = ko.observable(false);
    self.validationTracker = ko.observable();
    self.loanCurrency = ko.observable(self.localCurrency);
    self.productCurrencyList = ko.observable({});
    rootParams.baseModel.registerElement("amount-input");
    self.purposeData = ko.observableArray([]);
    self.currencyFetched = ko.observable(false);
    self.optionYears = ko.observableArray([]);
    self.optionMonths = ko.observableArray([]);
    self.years = 20;
    self.preferenceMode = ko.observableArray([]);
    self.disableContinue = ko.observable(false);
    self.requirementsPartial = ko.observable();

    const className = self.productDetails().productClassName;
    let payload;

    self.requirementsPartial(className.toLowerCase().replace(/#|_/g, "-"));
    self.requirementsPartial(self.requirementsPartial() + "-" + self.productDetails().productType.toLowerCase().replace(/#|_/g, "-"));

    for (i = 0; i <= self.years; i++) {
      self.optionYears.push({
        label: i,
        value: i
      });
    }

    for (i = 0; i <= 11; i++) {
      self.optionMonths.push({
        label: i,
        value: i
      });
    }

    let purchasePrice = 0,
      downpaymentAmount = 0;
    const url = "submissions/{submissionId}/loanApplications";

    self.requirementLoaded = ko.observable(false);
    rootParams.baseModel.registerComponent("loan-tenure", "origination");

    self.downPaymentRequiredChange = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.downPaymentRequired("OPTION_NO");
        self.productDetails().requirements.downpaymentAmount.amount(0);
        downpaymentAmount = 0;
        self.calculateLoanAmount();
      }

      if (event.detail.value === "OPTION_YES") {
        self.downPaymentRequired("OPTION_YES");
      }
    };

    self.getRequirementModel = function(type) {
      if (!self.productDetails().requirements) {
        self.productDetails().requirements = getNewKoModel(self.loanCurrency())[type];
        self.productDetails().requirements.temp_selectedValues = ko.observable(getNewKoModel().temp_selectedValues);
        self.productDetails().requirements.requestedAmount.amount = ko.observable(self.productDetails().requirements.requestedAmount.amount);

        if (self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure.years = ko.observable(JSON.stringify(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.years)));
          self.productDetails().requirements.requestedTenure.months = ko.observable(JSON.stringify(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.months)));
        }

        if (self.productDetails().requirements.purchasePrice) {
          self.productDetails().requirements.purchasePrice.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.purchasePrice.amount));
        }

        if (self.productDetails().requirements.downpaymentAmount) {
          self.productDetails().requirements.downpaymentAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.downpaymentAmount.amount));
        }
      } else {
        if (self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure.years = ko.observable(JSON.stringify(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.years)));
          self.productDetails().requirements.requestedTenure.months = ko.observable(JSON.stringify(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.months)));
        }

        if (!self.productDetails().requirements.purchasePrice && self.productDetails().productType === "AUTOMOBILE") {
          self.productDetails().requirements.purchasePrice = {};
          self.productDetails().requirements.purchasePrice.amount = ko.observable();
          self.productDetails().requirements.purchasePrice.currency = ko.utils.unwrapObservable(self.loanCurrency);
        }

        if (!self.productDetails().requirements.downpaymentAmount && self.productDetails().productType === "AUTOMOBILE") {
          self.productDetails().requirements.downpaymentAmount = {};
          self.productDetails().requirements.downpaymentAmount.amount = ko.observable();
          self.productDetails().requirements.downpaymentAmount.currency = ko.utils.unwrapObservable(self.loanCurrency);
        }

        if (!self.productDetails().requirements.requestedAmount) {
          self.productDetails().requirements.requestedAmount = {};
          self.productDetails().requirements.requestedAmount.amount = ko.observable();
          self.productDetails().requirements.requestedAmount.currency = ko.utils.unwrapObservable(self.loanCurrency);
        } else {
          self.productDetails().requirements.requestedAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedAmount.amount));
        }

        if (!self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure = {};
          self.productDetails().requirements.requestedTenure.years = ko.observable(0);
          self.productDetails().requirements.requestedTenure.months = ko.observable(0);
          self.productDetails().requirements.requestedTenure.days = 0;
        }
      }

      if (!self.productDetails().requirements.purpose) {
        self.productDetails().requirements.purpose = {};
        self.productDetails().requirements.purpose.code = "";
      }

      if (!self.productDetails().requirements.temp_selectedValues) {
        self.productDetails().requirements.temp_selectedValues = {
          purpose: ""
        };
      }

      self.productDetails().requirements.temp_selectedValues = ko.observable(self.productDetails().requirements.temp_selectedValues);
    };

    self.fetchRequirements = function() {
      RequirementsModel.fetchRequirements(self.productDetails().submissionId.value).done(function(data) {
        if (self.checkEmpty(data.loanApplicationRequirementDTO)) {
          if (data.loanApplicationRequirementDTO.requestedAmount) {
            self.productDetails().requirements.requestedAmount.amount(data.loanApplicationRequirementDTO.requestedAmount.amount);
            self.loanCurrency(data.loanApplicationRequirementDTO.requestedAmount.currency);
          }

          if (data.loanApplicationRequirementDTO.purchasePrice && data.loanApplicationRequirementDTO.purchasePrice.amount) {
            self.productDetails().requirements.purchasePrice.amount(data.loanApplicationRequirementDTO.purchasePrice.amount);
            purchasePrice = JSON.parse(JSON.stringify(self.productDetails().requirements.purchasePrice.amount()));
          }

          if (data.loanApplicationRequirementDTO.downpaymentAmount && data.loanApplicationRequirementDTO.downpaymentAmount.amount) {
            self.downPaymentRequired("OPTION_YES");
            self.productDetails().requirements.downpaymentAmount.amount(data.loanApplicationRequirementDTO.downpaymentAmount.amount);
            downpaymentAmount = JSON.parse(JSON.stringify(self.productDetails().requirements.downpaymentAmount.amount()));
          }

          if (data.loanApplicationRequirementDTO.requestedTenure) {
            self.productDetails().requirements.requestedTenure.years(JSON.stringify(data.loanApplicationRequirementDTO.requestedTenure.years));
            self.productDetails().requirements.requestedTenure.months(JSON.stringify(data.loanApplicationRequirementDTO.requestedTenure.months));
          }

          if (data.loanApplicationRequirementDTO.vehicleDetails && !self.productDetails().requirements.vehicleDetails) {
            self.productDetails().requirements.vehicleDetails = data.loanApplicationRequirementDTO.vehicleDetails;
            self.isVehicleDetailsSubmitted(true);
            self.vehicleDetails(JSON.parse(ko.toJSON(self.productDetails().requirements.vehicleDetails)));
          }

          if (data.loanApplicationRequirementDTO.purpose && data.loanApplicationRequirementDTO.purpose.code) {
            self.productDetails().requirements.purpose.code = data.loanApplicationRequirementDTO.purpose.code;
          }

          if (data.loanApplicationRequirementDTO.offerId) {
            self.productDetails().requirements.offerId = data.loanApplicationRequirementDTO.offerId;
          }
        }

        self.requirementLoaded(true);
      });
    };

    RequirementsModel.getAllowedCurrencies(self.productDetails().productCode).done(function (data) {
      self.productCurrencyList().currencies = data.currencyList;
      self.currencyFetched(true);

    if (self.productDetails().productType === "AUTOMOBILE") {
      self.getRequirementModel("autoloanRequirement");
      self.fetchRequirements();
    } else {
      if (jsonData.purposeTypeList) {
        self.purposeData(jsonData.purposeTypeList);
      }

      self.loanPurposeLoaded(true);
      self.getRequirementModel("loanRequirement");
      self.fetchRequirements();

    }

    if (self.productDetails().requirements && self.productDetails().requirements.purchasePrice) {
      const subscriptionPurchasePrice = self.productDetails().requirements.purchasePrice.amount.subscribe(function(newValue) {
          if (newValue) {
            purchasePrice = Number(newValue.toString().replace(/[^\d.]/g, ""));
            self.calculateLoanAmount();
          }
        }),
        downPaymentAmountPrice = self.productDetails().requirements.downpaymentAmount.amount.subscribe(function(newValue) {
          if (newValue) {
            downpaymentAmount = Number(newValue.toString().replace(/[^\d.]/g, ""));
            self.calculateLoanAmount();
          }
        });

      self.dispose = function() {
        subscriptionPurchasePrice.dispose();
        downPaymentAmountPrice.dispose();
      };
    }
  });

  self.checkEmpty = function (obj) {
    if (obj !== "" && obj && obj !== null) {
      return true;
    }

    return false;
  };

    self.calculateLoanAmount = function() {
      self.productDetails().requirements.requestedAmount.amount(parseInt(purchasePrice) - parseInt(downpaymentAmount));

      if (self.productDetails().requirements.requestedAmount.amount() <= 0) {
        $("#loanAmountError").show().trigger("openModal");
        self.disableContinue(true);
        self.productDetails().requirements.requestedAmount.amount(0);
      } else {
        self.disableContinue(false);
      }
    };

    self.submitRequirements = function() {
      const requirementsInfoTracker = document.getElementById("requirementsInfoTracker");

      if (requirementsInfoTracker.valid === "valid") {
        self.productDetails().requirements.productGroupCode = self.productDetails().productCode;
        self.productDetails().requirements.productGroupName = self.productDetails().productDescription;

        const productId = self.productDetails().productCode;

        self.productDetails().requirements.productClass = self.productDetails().productClassName;
        self.productDetails().requirements.productId = productId;

        if (self.productDetails().productType) {
          self.productDetails().requirements.productSubClass = self.productDetails().productType;
        }

        if (self.productDetails().requirements.requestedAmount) {
          self.productDetails().requirements.requestedAmount.currency = ko.utils.unwrapObservable(self.loanCurrency);
        }

        if (self.productDetails().requirements.downpaymentAmount) {
          self.productDetails().requirements.downpaymentAmount.currency = ko.utils.unwrapObservable(self.loanCurrency);
        }

        if (self.productDetails().requirements.purchasePrice) {
          self.productDetails().requirements.purchasePrice.currency = ko.utils.unwrapObservable(self.loanCurrency);
        }

        if (self.productDetails().requirements.purpose) {
          self.productDetails().requirements.purposeType = "PERSONAL";

          if (self.purposeData && self.purposeData() && self.purposeData()[0]) {
            self.productDetails().requirements.temp_selectedValues().purpose = rootParams.baseModel.getDescriptionFromCode(self.purposeData()[0].purposeList, self.productDetails().requirements.purpose.code);
          }
        }

        if (self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure.years(self.productDetails().requirements.requestedTenure.years());
          self.productDetails().requirements.requestedTenure.months(self.productDetails().requirements.requestedTenure.months());
        }

        self.productDetails().requirements.facilityId = self.productDetails().facilityId;
        self.productDetails().requirements.productGroupSerialNumber = self.productGroupSerialNumber();
        payload = JSON.parse(ko.toJSON(self.productDetails().requirements));

        if (!self.isVehicleDetailsSubmitted()) {
          delete payload.vehicleDetails;
        } else {
          payload.vehicleDetails = self.vehicleDetails();
        }

        RequirementsModel.submitRequirements(url, self.productDetails().submissionId.value, ko.mapping.toJSON(payload, {
          ignore: ["temp_selectedValues", "displayValue", "value", "selectedValues"]
        })).done(function() {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        });
      } else {
        requirementsInfoTracker.showMessages();
        requirementsInfoTracker.focusOn("@firstInvalidShown");
      }
    };

    self.exitApplication = function() {
      $("#EXITAPPLICATION").show().trigger("openModal");
    };
  };
});

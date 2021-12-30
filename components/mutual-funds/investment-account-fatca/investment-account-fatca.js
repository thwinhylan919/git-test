define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/investment-account-fatca",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojgauge",
  "ojs/ojradioset",
  "ojs/ojselectcombobox"
], function(ko, $, resourceBundle, FatcaModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.openAccountHeader);
    self.fetchedCountries = ko.observableArray();
    self.countriesLoaded = ko.observable(false);
    params.baseModel.registerComponent("investment-account-review", "mutual-funds");
    params.baseModel.registerComponent("investment-account-additional-details", "mutual-funds");
    params.baseModel.registerElement("amount-input");
    params.baseModel.registerElement("modal-window");
    self.taxIdentificationDocumentsList = ko.observable([]);
    self.documentListLoaded = ko.observable(false);
    self.openInvestmentAccountData().fatcaDetails.pepStatus = self.resource.pepStatusDummy;
    self.openInvestmentAccountData().fatcaDetails.addressType = self.resource.addressType1;
    self.openInvestmentAccountData().fatcaDetails.nationality = self.resource.indian;
    self.showCountryDetails = ko.observable(true);
    self.openInvestmentAccountData().fatcaDetails.spouseName = self.openInvestmentAccountData().personalDetails.spouseName;

    if (!self.openInvestmentAccountData().fatcaDetails.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo[0].taxResidenceCountry) {
      self.openInvestmentAccountData().fatcaDetails.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo[0].taxResidenceCountry = ko.observable(self.openInvestmentAccountData().fatcaDetails.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo[0].taxResidenceCountry);
    }

    if (!self.openInvestmentAccountData().fatcaDetails.grossAnnualIncome.amount) {
      self.openInvestmentAccountData().fatcaDetails.grossAnnualIncome.amount = ko.observable(self.openInvestmentAccountData().fatcaDetails.grossAnnualIncome.amount);
      self.openInvestmentAccountData().fatcaDetails.grossAnnualIncome.currency = ko.observable(self.openInvestmentAccountData().fatcaDetails.grossAnnualIncome.currency);
    }

    FatcaModel.fetchDocuments().done(function(data) {
      self.taxIdentificationDocumentsList(data.enumRepresentations[0].data);
      self.documentListLoaded(true);
    });

    FatcaModel.fetchCountries().done(function(data) {
      self.fetchedCountries(data.enumRepresentations[0].data);
      self.countriesLoaded(true);
    });

    self.showPopUp = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        $("#additionalInfo").trigger("openModal");
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.loadReview = function() {
      self.globalLoaded(false);
      self.stepArray()[self.stepArray().length - 1].disabled = false;
      self.stepArray()[self.stepArray().length - 1].visited = true;
      ko.tasks.runEarly();

      params.dashboard.loadComponent("investment-account-review", {
        openInvestmentAccountData: self.openInvestmentAccountData(),
        showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
        stepArray: self.stepArray()
      });

      self.globalLoaded(true);
    };

    self.loadAdditionalInfo = function() {
      $("#additionalInfo").trigger("closeModal");
      self.showTrain(false);
      ko.tasks.runEarly();
      self.showAdditionalDetailsSection(true);

      self.stepArray()[self.stepArray().length - 1].disabled = false;
      self.stepArray()[self.stepArray().length - 1].visited = true;

      if (self.stepArray()[self.stepArray().length - 1].id !== "investment-account-additional-details") {
        self.stepArray().push({
          label: self.resource.additionalDetails,
          id: "investment-account-additional-details",
          visited: true,
          disabled: false
        });

        self.selectedStepValueIA("investment-account-additional-details");
      }

      self.showTrain(true);
    };

    self.currencyParser = function(data) {
      const output = {};

      output.currencies = [];

      if (data) {
        if (data.currencyList && data.currencyList !== null) {
          for (let i = 0; i < data.currencyList.length; i++) {
            output.currencies.push({
              code: data.currencyList[i].code,
              description: data.currencyList[i].description
            });
          }
        }
      }

      return output;
    };

    self.deleteDetails = function(index) {
      self.showCountryDetails(false);
      ko.tasks.runEarly();
      self.openInvestmentAccountData().fatcaDetails.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo.splice(index, 1);
      self.showCountryDetails(true);
    };

    self.addDetails = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.showCountryDetails(false);
        ko.tasks.runEarly();

        let pushObj = {};

        pushObj = {
          taxResidenceCountry: ko.observable(),
          taxIdentifierType: null,
          taxIdentifier: null
        };

        self.openInvestmentAccountData().fatcaDetails.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo.push(pushObj);
        self.showCountryDetails(true);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.countryChangedHandler = function(indexUi, event) {
      if (event.detail.value) {
        self.openInvestmentAccountData().fatcaDetails.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo.forEach(function(obj, index) {
          if (event.detail.value === obj.taxResidenceCountry() && indexUi !== index) {
            self.openInvestmentAccountData().fatcaDetails.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo[indexUi].taxResidenceCountry("");
            $("#countryError").trigger("openModal");
          }
        });
      }
    };

    self.closePopUp = function() {
      $("#countryError").trigger("closeModal");
    };
  };
});

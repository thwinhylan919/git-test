define([

  "knockout",

  "ojL10n!resources/nls/investment-account-primary-liabilities",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox",
  "ojs/ojformlayout"
], function(ko, resourceBundle, LiabilityModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;

    self.liabilitiesList = ko.observable([]);
    self.liabilitiesLoaded = ko.observable(false);
    self.repaymentFrequencyList = ko.observable([]);
    self.repaymentFrequencyListLoaded = ko.observable(false);
    params.baseModel.registerElement("amount-input");
    self.showLiabilities = ko.observable(true);

    if (self.openInvestmentAccountData().additionalDetails.liability[0]) {
      self.dummyModal.additionalDetails.liability = self.openInvestmentAccountData().additionalDetails.liability;
    } else {
      self.dummyModal.additionalDetails.liability = [];

      self.dummyModal.additionalDetails.liability.push({
        liabilityType: null,
        original: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        outstanding: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        repaymentFrequency: null,
        liabilityRequired: ko.observable(false)
      });
    }

    LiabilityModel.fetchLiabilityTypes().done(function(data) {
      self.liabilitiesList(data.enumRepresentations[0].data);
      self.liabilitiesLoaded(true);
    });

    LiabilityModel.fetchRepaymentFrequency().done(function(data) {
      self.repaymentFrequencyList(data.enumRepresentations[0].data);
      self.repaymentFrequencyListLoaded(true);
    });

    self.addLiability = function() {
      self.showLiabilities(false);
      ko.tasks.runEarly();

      let pushObj = {};

      pushObj = {
        liabilityType: null,
        original: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        outstanding: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        repaymentFrequency: null,
        liabilityRequired: ko.observable(false)
      };

      self.dummyModal.additionalDetails.liability.push(pushObj);
      self.showLiabilities(true);
    };

    self.deleteLiability = function(index) {
      self.showLiabilities(false);
      ko.tasks.runEarly();
      self.dummyModal.additionalDetails.liability.splice(index, 1);
      self.showLiabilities(true);
    };

    self.liabilitySelectedHandler = function(index, event) {
      if (event.detail.value) {
        self.dummyModal.additionalDetails.liability[index].liabilityRequired(true);
      }
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

    self.onClickSave = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.dummyModal.additionalDetails.liability.forEach(function(liability) {
          if (liability.liabilityType) {
            self.openInvestmentAccountData().additionalDetails.liability.push(liability);
          }
        });

        self.selectedComponent("investment-account-investments");
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});

define([

  "knockout",

  "ojL10n!resources/nls/investment-account-investments",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(ko, resourceBundle, InvestmentModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.investmentsList = ko.observable([]);
    self.investmentListLoaded = ko.observable(false);
    params.baseModel.registerElement("amount-input");
    self.showInvestments = ko.observable(true);
    self.today = ko.observable(params.baseModel.getDate());

    if (self.openInvestmentAccountData().additionalDetails.investments[0]) {
      self.dummyModal.additionalDetails.investments = self.openInvestmentAccountData().additionalDetails.investments;
    } else {
      self.dummyModal.additionalDetails.investments = [];

      self.dummyModal.additionalDetails.investments.push({
        investmentDate: null,
        value: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        investmentType: null,
        investmentRequired: ko.observable(false)
      });
    }

    InvestmentModel.fetchInvestmentTypes().done(function(data) {
      self.investmentsList(data.enumRepresentations[0].data);
      self.investmentListLoaded(true);
    });

    self.addInvestment = function() {
      self.showInvestments(false);
      ko.tasks.runEarly();

      let pushObj = {};

      pushObj = {
        investmentDate: null,
        value: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        investmentType: null,
        investmentRequired: ko.observable(false)
      };

      self.dummyModal.additionalDetails.investments.push(pushObj);
      self.showInvestments(true);
    };

    self.deleteInvestment = function(index) {
      self.showInvestments(false);
      ko.tasks.runEarly();
      self.dummyModal.additionalDetails.investments.splice(index, 1);
      self.showInvestments(true);
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

    self.investmentSelectedHandler = function(index, event) {
      if (event.detail.value) {
        self.dummyModal.additionalDetails.investments[index].investmentRequired(true);
      }
    };

    self.onClickSave = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.dummyModal.additionalDetails.investments.forEach(function(investment) {
          if (investment.investmentType) {
            self.openInvestmentAccountData().additionalDetails.investments.push(investment);
          }
        });

        self.selectedComponent("investment-account-relatives");
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});

define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/investment-details-widget"
], function(ko, Model, resourceBundle) {
  "use strict";

  return function() {
    const self = this;

    self.nls = resourceBundle;

    self.pieSeriesValue = ko.observableArray();

    const marketValue = [],
      investedAmount = [];

    self.distributionLoaded = ko.observable(false);
    self.pieGroupsValue = ko.observableArray();

    const promises = [],
      accounts = [];

    Model.fetchInvestmentSummary().done(function(data) {
      let i = 0;

      const accountList = data.investmentAccounts;

      for (i = 0; i < accountList.length; i++) {
        accounts[i] = accountList[i].accountId.displayValue;
      }

      accountList.forEach(function(element) {
        promises.push(Model.fetchAccountSummary(element.accountId.value));
      });

      Promise.all(promises).then(function(array) {
        for (i = 0; i < array.length; i++) {
          marketValue[i] = array[i].investmentSummaryDTO.marketValue.amount;
          investedAmount[i] = array[i].investmentSummaryDTO.amountInvested.amount;
        }

        const barGraphValues = [{
            name: self.nls.InvestmentAllocation.marketValue,
            items: marketValue
          },
          {
            name: self.nls.InvestmentAllocation.amountInvested,
            items: investedAmount
          }
        ];

        self.pieSeriesValue(barGraphValues);
        self.pieGroupsValue(accounts);
        self.distributionLoaded(true);
      });
    });
  };
});

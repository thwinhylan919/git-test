define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/performance-analysis-widget"
], function(ko, Model, resourceBundle) {
  "use strict";

  return function() {
    const self = this;

    self.nls = resourceBundle;

    self.lineSeriesValue = ko.observableArray();

    self.distributionLoaded = ko.observable(false);
    self.lineGroupsValue = ko.observableArray();

    const promises = [],
      duration = [],
      lineSeriesValues = [],
      accounts = [];

    Model.fetchInvestmentAccounts().done(function(data) {
      let i = 0,
        k = 0,
        j = 0;

      const accountList = data.investmentAccounts;

      for (i = 0; i < accountList.length; i++) {
        accounts[i] = accountList[i].accountId.displayValue;
      }

      accountList.forEach(function(element) {
        promises.push(Model.fetchPerformance(element.accountId.value));
      });

      Promise.all(promises).then(function(array) {
        for (j = 0; j < accounts.length; j++) {
          const values = [];

          for (i = 0; i < array.length; i++) {
            for (k = 0; k < array[i].investmentAccountPerformances.length; k++) {
              values[k] = array[i].investmentAccountPerformances[k].rateOfReturn;
            }
          }

          lineSeriesValues.push({
            name: accounts[j],
            items: values
          });
        }

        for (i = 0; i < array[0].investmentAccountPerformances.length; i++) {
          if (array[0].investmentAccountPerformances[i].duration > 12) {
            duration[i] = (array[0].investmentAccountPerformances[i].duration / 12) + self.nls.InvestmentAllocation.yearsSuffix;
          } else if (array[0].investmentAccountPerformances[i].duration === 12) {
            duration[i] = (array[0].investmentAccountPerformances[i].duration / 12) + self.nls.InvestmentAllocation.yearSuffix;
          } else if (array[0].investmentAccountPerformances[i].duration === 1) {
            duration[i] = array[0].investmentAccountPerformances[i].duration + self.nls.InvestmentAllocation.monthSuffix;
          } else {
            duration[i] = array[0].investmentAccountPerformances[i].duration + self.nls.InvestmentAllocation.monthsSuffix;
          }
        }

        self.lineSeriesValue(lineSeriesValues);
        self.lineGroupsValue(duration);
        self.distributionLoaded(true);
      });
    });
  };
});

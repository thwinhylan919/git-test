define([
    "knockout",
    "ojL10n!resources/nls/maker-work-box"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.dataLoaded = ko.observable(false);
    rootParams.baseModel.registerComponent("work-box", "base-components");
    rootParams.baseModel.registerElement("action-widget");

    const financialTxn = [
        "ACCOUNT_FINANCIAL",
        "PAYMENTS",
        "BULK_FILE",
        "BULK_RECORD"
      ],
      nonFinancialTxn = [
        "ACCOUNT_NON_FINANCIAL",
        "PAYEE_BILLER",
        "NON_FINANCIAL_BULK_FILE",
        "NON_FINANCIAL_BULK_RECORD",
        "TRADE_FINANCE",
        "FOREX_DEAL"
      ],
      financialTxnList = [],
      nonFinancialTxnList = [];

    self.heading = resourceBundle.heading;
    self.nls = resourceBundle;
    self.workBoxData = ko.observableArray([]);
    self.currentSelection = ko.observable();

    rootParams.dashboard.getDashboardPromise().then(function(data) {
      if (data.countDTOList && data.countDTOList.length) {
        const data1 = data.countDTOList;

        for (let i = 0; i < data1.length; i++) {
          const record = data1[i];

          record.status = [];
          record.header = resourceBundle[record.transactionType];

          record.status.push({
            count: record.approved || 0,
            status: resourceBundle.approved,
            icon: "icon icon-check"
          });

          record.status.push({
            count: record.initiated || 0,
            status: resourceBundle.initiated,
            icon: "icon icon-alert"
          });

          record.status.push({
            count: record.rejected || 0,
            status: resourceBundle.rejected,
            icon: "icon icon-close"
          });

          if (financialTxn.indexOf(data1[i].transactionType) > -1) {
            financialTxnList.push(record);
          }

          if (nonFinancialTxn.indexOf(data1[i].transactionType) > -1) {
            nonFinancialTxnList.push(record);
          }
        }

        self.currentSelection.subscribe(function(value) {
          self.workBoxData.removeAll();

          if (value === "financialTxn") {
            ko.utils.arrayPushAll(self.workBoxData, financialTxnList);
          } else if (value === "nonfinancialTxn") {
            ko.utils.arrayPushAll(self.workBoxData, nonFinancialTxnList);
          }
        });

        self.currentSelection("financialTxn");
        self.dataLoaded(true);
      }
    });
  };
});
define([
    "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/wallets-report",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(ko, $, walletTxnActivityModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.txnMap = {};
    self.Nls = resourceBundle.wallets;
    self.validationTracker = ko.observable();
    self.walletTransactions = ko.observableArray();
    self.isWalletTransactionsLoaded = ko.observable(false);

    walletTxnActivityModel.fetchEnumeration().done(function(data) {
      self.walletTransactions(data.enumRepresentations[0].data);
      self.isWalletTransactionsLoaded(true);

      for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.txnMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
      }
    });

    self.onTxnTypeSelected = function(event) {
      if (event.detail.value) {
        $("#txnDisplayName").val(self.txnMap[event.detail.value]);
      }
    };
  };
});
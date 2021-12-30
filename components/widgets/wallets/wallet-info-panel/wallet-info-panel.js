define([
  "knockout",
    "./model",
  "ojL10n!resources/nls/wallet-notification-card",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext"
], function(ko, WalletInfoPanelModel, ResourceBundle) {
  "use strict";

  return function viewModel(rootParams) {
    const self = this;

    self.wallet = ResourceBundle.wallet;
    self.creditPoints = ko.observable("0");
    self.foramtedAmount = ko.observable();
    WalletInfoPanelModel.init(rootParams.dashboard.dataToBePassed().walletId.value);

    self.refreshWallet = function() {
      WalletInfoPanelModel.getWalletDetails().done(function(data) {
        self.walletAmount(data.balance.availableBalance.amount);
        self.walletCurrency(data.balance.availableBalance.currency);
        self.foramtedAmount(rootParams.baseModel.formatCurrency(self.walletAmount(), self.walletCurrency()));
      });
    };

    self.refreshWallet();
  };
});
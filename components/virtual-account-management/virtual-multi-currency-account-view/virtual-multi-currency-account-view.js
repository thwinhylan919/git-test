define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-multi-currency-account-search",
  "ojs/ojbutton"
], function (ko, $, VirtualMultiCurrencyAccountModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel);
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerTransaction("virtual-multi-currency-account", "virtual-account-management");
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.realCustomerNoDisplay = params.dashboard.userData.userProfile.partyId.displayValue;
    self.virtualMultiCurrencyListDTO = ko.observable();
    self.virtualMCA = ko.observable(params.rootModel.params.virtualMCA !== undefined ? params.rootModel.params.virtualMCA : "");
    self.accountBalanceData = ko.observable();
    self.balanceLoaded = ko.observable(false);
    self.virtualMCADetailsLoaded = ko.observable(false);
    self.updateMessage = ko.observable(self.resource.deleteConfirm);

    self.backToSearch = function () {
      params.dashboard.loadComponent("virtual-multi-currency-account-search", {});
    };

    self.getRecordStatus = function () {
      return self.virtualMultiCurrencyListDTO().status === "O" ? self.resource.active : self.resource.closed;
    };

    self.getBalance = function (realAccountNo) {
      const tempArray = self.accountBalanceData().filter(function (accountNo) {
        return accountNo.realAccountNo.value === realAccountNo;
      });

      return tempArray[0].availableBalance.amount;
    };

    VirtualMultiCurrencyAccountModel.readVirtualMultiCurrencyAccount(self.virtualMCA()).then(function (data) {
      if (data && data.multiCurrencyAccount) {
        self.virtualMultiCurrencyListDTO(data.multiCurrencyAccount);

        VirtualMultiCurrencyAccountModel.fetchVAEnabledRealAccount().then(function (data) {
          if (data && data.vamaccountdtos && data.vamaccountdtos.length > 0) {
            self.accountBalanceData(data.vamaccountdtos);

            for (let i = 0; i < self.virtualMultiCurrencyListDTO().accounts.length; i++) {
              self.virtualMultiCurrencyListDTO().accounts[i].balance = self.getBalance(self.virtualMultiCurrencyListDTO().accounts[i].id.value);
            }

            self.balanceLoaded(true);
          }
        });

        self.virtualMultiCurrencyListDTO().accounts.sort(function (a, b) {
          return b.defaultAccount - a.defaultAccount;
        });

        self.virtualMCADetailsLoaded(true);
      }
    });

    self.edit = function () {
      params.dashboard.loadComponent("virtual-multi-currency-account", {
        virtualMultiCurrencyListDTO: JSON.stringify(self.virtualMultiCurrencyListDTO()),
        mode: "edit",
        fromView: true
      });
    };

    self.deleteConfirm = function () {
      $("#virtualMultiCcyDelete").trigger("openModal");
    };

    self.doNotDelete = function () {
      $("#virtualMultiCcyDelete").trigger("closeModal");
    };

    self.confirmScreenCreateMessage = function () {
      return resourceBundle.confirmScreenDeleteMessage;
    };

    self.deleteVirtualMultiCurrencyAccount = function () {
      VirtualMultiCurrencyAccountModel.deleteMultiCcyAccount(self.virtualMultiCurrencyListDTO().groupId).then(
        function (data) {
          if ((data.messages && data.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
            params.baseModel.showMessages(null, [data.message.detail], "error");
            $("#virtualMultiCcyDelete").trigger("closeModal");
          } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.resource.title,
              eReceiptRequired: true,
              confirmScreenExtensions: {
                resource: resourceBundle,
                isSet: true,
                confirmScreenDetails: [{
                  virtualMultiCurrencyAccountNo: self.virtualMultiCurrencyListDTO().groupId,
                  virtualMultiCurrencyAccountName: self.virtualMultiCurrencyListDTO().name
                }],
                template: "confirm-screen/virtual-multi-currency-account-delete-confirm-screen"
              }
            });
          } else {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.resource.title,
              eReceiptRequired: true,
              confirmScreenExtensions: {
                resource: resourceBundle,
                confirmScreenMsgEval: self.confirmScreenCreateMessage,
                isSet: true,
                confirmScreenDetails: [{
                  virtualMultiCurrencyAccountNo: self.virtualMultiCurrencyListDTO().groupId,
                  virtualMultiCurrencyAccountName: self.virtualMultiCurrencyListDTO().name
                }],
                template: "confirm-screen/virtual-multi-currency-account-delete-confirm-screen"
              }
            });
          }
        });
    };
  };

});
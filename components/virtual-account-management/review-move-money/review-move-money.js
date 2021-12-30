define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/create-move-money",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup"
], function (ko, MoveMoneyModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("create-move-money", "virtual-account-management");
    self.updateMessage = ko.observable(self.resource.title);
    self.selectedAccount = ko.observable();
    self.selectedVirtualAccountFrom = ko.observable();
    self.selectedVirtualAccountTo = ko.observable();
    self.selectedVirtualAccountBalance = ko.observable();
    self.virtualAccountData = ko.observable([]);
    self.virtualAccountLoaded = ko.observable(false);
    self.currencyListData = ko.observableArray([]);
    self.currencyLoaded = ko.observable(false);
    self.showVirtualAccountFromInfo = ko.observable();
    self.showVirtualAccountToInfo = ko.observable();
    self.defaultAccCcy = ko.observable();
    self.amount = ko.observable();
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.moveMoneyPayload = ko.observable([]);
    self.realAccountNoDisplay = ko.observable();
    self.widgetFlag = ko.observable(params.rootModel.params.fromWidget);
    self.fromApproval = ko.observable();

    if (params.rootModel.params.payload) {
      self.moveMoneyPayload(params.rootModel.params.payload.intbks);
      self.realAccountNoDisplay(self.moveMoneyPayload().realAccountNo.displayValue());
    }

    if (params.rootModel.params.data) {
      self.fromApproval(true);
      self.moveMoneyPayload(params.rootModel.params.data);
    } else {
      self.fromApproval(false);
    }

    self.confirmScreenCreateMessage = function () {
      return self.resource.moveMoneyCreateMessage;
    };

    self.backToCreate = function () {
      params.dashboard.loadComponent("create-move-money", {
        moveMoneyPayload: ko.mapping.toJS(self.moveMoneyPayload()),
        balanceFrom: params.rootModel.params.balanceFrom,
        balanceTo: params.rootModel.params.balanceTo,
        currencyParser: params.rootModel.params.currencyParser
      });
    };

    self.confirm = function () {
      const moveMoneyCreateDto = ko.toJSON(self.moveMoneyPayload());

      MoveMoneyModel.paymentTransfer(moveMoneyCreateDto).then(function (data) {
        if ((data.message && data.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
          params.baseModel.showMessages(null, [data.message.detail], "error");
        } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.updateMessage(),
            confirmScreenExtensions: {
              resource: resourceBundle,
              isSet: true,
              confirmScreenDetails: [{
                transferFrom: self.moveMoneyPayload().debitAccountId(),
                transferTo: self.moveMoneyPayload().creditAccountId(),
                currency: self.moveMoneyPayload().creditAmount.currency(),
                amount: self.moveMoneyPayload().debitAmount.amount()
              }],
              template: "confirm-screen/create-move-money-confirmation"
            }
          });
        } else {
          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            hostReferenceNumber: data.responseDTO.paymentId,
            transactionName: self.updateMessage(),
            confirmScreenExtensions: {
              confirmScreenMsgEval: self.confirmScreenCreateMessage,
              resource: resourceBundle,
              isSet: true,
              confirmScreenDetails: [{
                transferFrom: self.moveMoneyPayload().debitAccountId(),
                transferTo: self.moveMoneyPayload().creditAccountId(),
                currency: self.moveMoneyPayload().creditAmount.currency(),
                amount: self.moveMoneyPayload().debitAmount.amount()
              }],
              template: "confirm-screen/create-move-money-confirmation"
            }
          });
        }
      });
    };
  };
});

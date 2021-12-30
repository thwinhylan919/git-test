define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/auto-pay",
  "ojs/ojknockout",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojradioset"
], function(ko, $, AutoPayModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.autopay.cardHeading);
    self.cardObject = self.params;
    self.payAmtType = ko.observable("");
    self.registerCancel = ko.observable(false);
    self.initiateCancel = ko.observable(false);
    self.verifyCancel = ko.observable(false);
    self.confirmCancel = ko.observable(false);
    self.validationTracker = ko.observable();
    self.accounts = ko.observable();
    self.additionalDetails = ko.observable();
    self.selectedAccount = ko.observable();
    self.referenceNumber = ko.observable("");
    self.currentRepayMode = ko.observable("");
    self.currentActionType = ko.observable("");
    self.additionalCardDetails = ko.observable();
    self.creditCardId = ko.observable();
    self.moduleURL = ko.observable();
    self.creditCardIdDisplay = ko.observable();
    self.refLinksLoaded = ko.observable(false);
    self.srNo = ko.observable();
    self.repaymentAmount = ko.observable();
    self.currency = ko.observable("GBP");
    self.creditCardArray = ko.observableArray([]);
    self.addonCardFlag = ko.observable(false);
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerComponent("review-auto-pay", "creditcard");
    rootParams.baseModel.registerComponent("creditcard-reset-pin", "creditcard");
    rootParams.baseModel.registerComponent("add-on-card", "creditcard");
    rootParams.baseModel.registerComponent("card-pay", "creditcard");
    rootParams.baseModel.registerComponent("card-statement", "creditcard");
    rootParams.baseModel.registerComponent("block-card", "creditcard");
    rootParams.baseModel.registerComponent("request-pin", "creditcard");

    let confData;

    self.creditCardId.subscribe(function() {
      if (rootParams.baseModel.small()) {
        self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.params;
      }

      ko.tasks.runEarly();

      if (self.creditCardId() && self.cardObject.cardOwnershipType === "ADDON") {
        self.addonCardFlag(true);
      } else {
        self.addonCardFlag(false);
        self.initAutoPay();
      }

      self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
    });

    if (self.params.id) {
      self.creditCardId(self.params.id.value);
      self.creditCardIdDisplay(self.params.id.displayValue);
    }

    if (self.params.jsonData) {
      self.moduleURL(self.params.jsonData.moduleURL);
    }

    self.autoPayRegister = function() {
      self.registerCancel(false);
      self.initiateCancel(true);
    };

    self.autoPayCancelRegister = function() {
      history.back();
    };

    self.autoPayVerify = function(actionType) {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      self.currentActionType(actionType);

      if (typeof self.additionalDetails() === "function") {
        return;
      }

      let repayMode = null;

      if (self.currentActionType() === "reg") {
        repayMode = "A";
      } else {
        repayMode = self.currentRepayMode();
      }

      if (self.payAmtType() === "SAD") {
        confData = {
          repayMode: repayMode,
          repaymentAmountType: self.payAmtType(),
          accountId: self.additionalDetails().account.id,
          partyId: self.partyId,
          repaymentAmount: {
            amount: self.repaymentAmount(),
            currency: self.currency()
          }
        };
      } else {
        confData = {
          repayMode: repayMode,
          repaymentAmountType: self.payAmtType(),
          accountId: self.additionalDetails().account.id,
          partyId: self.partyId
        };
      }

      const context = {};

      self.verifyCancel(true);
      context.headerName = rootParams.dashboard.headerName();
      context.confData = confData;
      context.actionType = actionType;
      context.verifyCancel = self.verifyCancel();
      context.creditCardIdDisplay = self.creditCardIdDisplay();
      context.payAmtType = self.payAmtType();
      context.repaymentAmount = self.repaymentAmount();
      context.currency = self.currency();
      context.autoPayConfirm = self.autoPayConfirm;
      context.currentActionType = self.currentActionType();
      rootParams.dashboard.loadComponent("review-auto-pay", context);
    };

    self.autoPayConfirm = function() {
      if (self.currentActionType() === "reg") {
        AutoPayModel.createAutopay(ko.toJSON(confData), self.creditCardId()).then(function(data) {
          if (typeof data.serviceID !== "undefined") {
            self.srNo(data.serviceID);

            rootParams.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              sr: true,
              transactionName: self.resource.autopay.createAuto,
              serviceNo: data.serviceID,
              srNo: self.srNo(),
              resourceBundle: self.resource,
              confirmScreenExtensions: {
                isSet: true,
                template: "confirm-screen/cc-template",
                flagAutoPay: true,
                confData: confData,
                taskCode: "CC_N_ARRG",
                creditCardIdDisplay: self.creditCardIdDisplay
              }
            }, self);
          } else {
            rootParams.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.resource.autopay.createAuto,
              resourceBundle: self.resource,
              confirmScreenExtensions: {
                isSet: true,
                template: "confirm-screen/cc-template",
                flagAutoPay: true,
                confData: confData,
                taskCode: "CC_N_ARRG",
                creditCardIdDisplay: self.creditCardIdDisplay
              }
            }, self);
          }

          self.verifyCancel(false);
          self.initiateCancel(false);
          self.confirmCancel(true);
        });
      } else if (self.currentActionType() === "upd") {
        AutoPayModel.updateAutopay(ko.toJSON(confData), self.creditCardId()).then(function(data) {
          if (typeof data.serviceID !== "undefined") {
            self.srNo(data.serviceID);

            rootParams.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              sr: true,
              transactionName: self.resource.autopay.updateAuto,
              serviceNo: data.serviceID,
              srNo: self.srNo(),
              resourceBundle: self.resource,
              confirmScreenExtensions: {
                isSet: true,
                template: "confirm-screen/cc-template",
                flagAutoPay: true,
                confData: confData,
                taskCode: "CC_N_ARU",
                creditCardIdDisplay: self.creditCardIdDisplay
              }
            }, self);
          } else {
            rootParams.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.resource.autopay.updateAuto,
               resourceBundle: self.resource,
              confirmScreenExtensions: {
                isSet: true,
                template: "confirm-screen/cc-template",
                flagAutoPay: true,
                confData: confData,
                taskCode: "CC_N_ARU",
                creditCardIdDisplay: self.creditCardIdDisplay
              }
            }, self);
          }

          self.verifyCancel(false);
          self.initiateCancel(false);
          self.confirmCancel(true);
        });
      } else if (self.currentActionType() === "dereg") {
        AutoPayModel.deleteAutopay(ko.toJSON(confData), self.creditCardId()).then(function(data) {
          if (typeof data.serviceID !== "undefined") {
            self.srNo(data.serviceID);

            rootParams.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              sr: true,
              transactionName: self.resource.autopay.delete,
              serviceNo: data.serviceID,
              srNo: self.srNo(),
              resourceBundle: self.resource,
              confirmScreenExtensions: {
                isSet: true,
                template: "confirm-screen/cc-template",
                flagAutoPay: true,
                confData: confData,
                taskCode: "CC_N_ARDRG",
                creditCardIdDisplay: self.creditCardIdDisplay
              }
            }, self);
          } else {
            rootParams.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.resource.autopay.delete,
              resourceBundle: self.resource,
              confirmScreenExtensions: {
                isSet: true,
                template: "confirm-screen/cc-template",
                flagAutoPay: true,
                confData: confData,
                taskCode: "CC_N_ARDRG",
                creditCardIdDisplay: self.creditCardIdDisplay
              }
            }, self);
          }

          self.verifyCancel(false);
          self.initiateCancel(false);
          self.confirmCancel(true);
        });
      }
    };

    self.initAutoPay = function() {
      AutoPayModel.fetchAutopay(self.creditCardId()).done(function(data) {
        if (typeof data.repayMode !== "undefined") {
          self.currentRepayMode("A");
        } else {
          self.currentRepayMode("M");
        }

        if (self.currentRepayMode() === "M") {
          self.payAmtType("TAD");
          self.registerCancel(true);
        } else if (self.currentRepayMode() === "A") {
          self.payAmtType(data.repaymentAmountType);
          self.initiateCancel(true);
        }
      });
    };

    self.creditCardParser = function(data) {
      for (let i = 0; i < data.creditcards.length; i++) {
        if (data.creditcards[i].cardStatus === "ACT") {
          self.creditCardArray.push(data.creditcards[i]);
          data.accounts = self.creditCardArray();
        }
      }

      data.accounts = data.creditcards;

      data.accounts.map(function(creditCard) {
        creditCard.id = creditCard.creditCard;
        creditCard.partyId = data.associatedParty;
        creditCard.accountNickname = creditCard.cardNickname;
        creditCard.associatedParty = data.associatedParty;

        return creditCard;
      });

      return data;
    };

    self.showFloatingPanel = function() {
      $("#panelCreditCard6")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };

    self.loadFloatingPanel = function(componentName){
      rootParams.dashboard.loadComponent(componentName, ko.mapping.toJS(self.params));
    };
  };
});

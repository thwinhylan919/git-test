define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/card-pay",
  "ojs/ojknockout",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojradioset"
], function (ko, $, CardPayModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.cardObject = self.params;
    rootParams.dashboard.headerName(self.resource.pay.cardHeading);
    self.accBalance = ko.observable();

    if (rootParams.rootModel.previousState) {
      self.payAmtType = rootParams.rootModel.previousState.confData.payAmtType;
      self.sourceAccountLoaded = ko.observable(true);
      self.verifyCancel = ko.observable(true);
      self.selectedAccount = rootParams.rootModel.previousState.selectedAccount;
      self.specificedAmount = rootParams.rootModel.previousState.confData.amount.amount;
    } else {
      self.payAmtType = ko.observable(self.resource.pay.outstanding);
      self.sourceAccountLoaded = ko.observable(false);
      self.verifyCancel = ko.observable(false);
      self.selectedAccount = ko.observable();
      self.specificedAmount = ko.observable();
    }

    self.initiateCancel = ko.observable(false);
    self.otpCancel = ko.observable(false);
    self.confirmCancel = ko.observable(false);
    self.validationTracker = ko.observable();
    self.accounts = ko.observable();
    self.additionalDetails = ko.observable();
    self.selectedAccountData = ko.observable();
    self.refernceNumber = ko.observable("");
    self.paymentId = ko.observable("");
    self.invalidOtpEntered = ko.observable(false);
    self.authKey = ko.observable("");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerComponent("review-card-pay", "creditcard");
    rootParams.baseModel.registerComponent("creditcard-reset-pin", "creditcard");
    rootParams.baseModel.registerComponent("auto-pay", "creditcard");
    rootParams.baseModel.registerComponent("add-on-card", "creditcard");
    rootParams.baseModel.registerComponent("card-statement", "creditcard");
    rootParams.baseModel.registerComponent("block-card", "creditcard");
    rootParams.baseModel.registerComponent("request-pin", "creditcard");
    rootParams.baseModel.registerComponent("my-limits", "limits-enquiry");
    self.additionalCardDetails = ko.observable();
    self.creditCardId = ko.observable();
    self.moduleURL = ko.observable();
    self.creditCardIdDisplay = ko.observable();
    self.viewlimits = ko.observable(false);
    self.customLimitType = ko.observable("");
    self.loadAccessPointList = ko.observable(false);
    self.selectedChannelTypeName = ko.observable();
    self.selectedChannelType = ko.observable();
    self.selectedChannelIndex = ko.observable();
    self.selectedChannel = ko.observable(false);
    self.showMylimits = ko.observable(false);

    self.channelTypeChangeHandler = function () {
      if (self.selectedChannelIndex() !== null && self.selectedChannelIndex() !== "") {
        self.selectedChannel(false);
        ko.tasks.runEarly();
        self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
        self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
        self.selectedChannel(true);
      }
    };

    self.channelList = ko.observableArray();

    CardPayModel.listAccessPoint().done(function (data) {
      self.channelList(data.accessPointListDTO);
      self.loadAccessPointList(true);
    });

    self.creditCardId.subscribe(function () {
      self.initiateCancel(false);

      if (rootParams.baseModel.small()) {
        self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;
      }

      ko.tasks.runEarly();
      self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
      self.initiateCancel(true);
    });

    if (self.params.id) {
      self.creditCardId(self.params.id.value);
      self.creditCardIdDisplay(self.params.id.displayValue);
    }

    if (self.params.jsonData) {
      self.moduleURL(self.params.jsonData.moduleURL);
    }

    let confData = null;

    self.payVerify = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      if (typeof self.additionalDetails() === "undefined") {
        return;
      }

      let payAmt = null,
        payCurr = null;

      if (self.payAmtType() === "Minimum") {
        payAmt = self.cardObject.due.minimumAmount.amount;
        payCurr = self.cardObject.cardCurrency;
      } else if (self.payAmtType() === "Outstanding") {
        payAmt = self.cardObject.due.billedAmount.amount;
        payCurr = self.cardObject.cardCurrency;
      } else {
        payAmt = parseFloat(self.specificedAmount());
        payCurr = self.cardObject.cardCurrency;
      }

      confData = {
        amount: {
          currency: payCurr,
          amount: payAmt
        },
        userReferenceNo: null,
        remarks: null,
        purpose: null,
        debitAccountId: self.additionalDetails().account.id,
        creditCardId: self.cardObject.creditCard
      };

      self.initiateCancel(false);
      self.verifyCancel(true);

      const context = {};

      context.creditCardIdDisplay = self.creditCardIdDisplay();
      context.headerName = rootParams.dashboard.headerName();
      context.verifyCancel = self.verifyCancel();
      context.initiateCancel = self.initiateCancel();
      context.confData = confData;
      context.payConfirm = self.payConfirm;
      context.otpCancel = self.otpCancel();
      context.invalidOtpEntered = self.invalidOtpEntered();
      context.confirmPaymentWithAuth = self.confirmPaymentWithAuth;
      rootParams.dashboard.loadComponent("review-card-pay", context);
    };

    self.showFloatingPanel = function () {
      $("#panelCreditCard3")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };

    self.loadFloatingPanel = function (componentName) {
      rootParams.dashboard.loadComponent(componentName, ko.mapping.toJS(self.params));
    };

    self.payConfirm = function () {
      CardPayModel.paybill(ko.toJSON(confData)).then(function (data) {
        self.refernceNumber(data.externalReferenceId);
        self.verifyCancel(false);

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resource.pay.payConfirm,
          hostReferenceNumber: self.refernceNumber(),
          confirmScreenExtensions: {
            isSet: true,
            template: "confirm-screen/cc-template",
            confData: confData,
            flagCardPay: true,
            taskCode: "CC_F_CPC",
            resourceBundle: self.resource
          }
        }, self);

        self.otpCancel(false);
      });
    };

    self.viewLimitsModalId = Date.now().toString();

    self.viewLimits = function () {
      self.showMylimits(true);
      self.viewlimits(false);
      self.customLimitType("CC_F_CCPC");
      ko.tasks.runEarly();
      $("#" + self.viewLimitsModalId).trigger("openModal");
      self.viewlimits(true);
    };

    self.done = function () {
      $("#" + self.viewLimitsModalId).trigger("closeModal");
      self.showMylimits(false);
    };

    self.closeModal = function () {
      self.showMylimits(false);
    };

    self.confirmPaymentWithAuth = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      CardPayModel.confirmPaymentWithAuth(self.paymentId(), self.authKey()).done(function (data) {
        self.refernceNumber(data.externalReferenceId);

        if (data.tokenValid) {
          self.otpCancel(false);
          self.confirmCancel(true);
        } else {
          self.invalidOtpEntered(true);
        }
      });
    };

    self.creditCardParser = function (data) {
      data.accounts = data.creditcards;

      data.accounts.map(function (creditCard) {
        creditCard.id = creditCard.creditCard;
        creditCard.partyId = data.associatedParty;
        creditCard.accountNickname = creditCard.cardNickname;
        creditCard.associatedParty = data.associatedParty;

        return creditCard;
      });

      return data;
    };
  };
});
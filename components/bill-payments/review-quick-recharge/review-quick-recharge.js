define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/quick-payments",
  "ojs/ojbutton",
  "ojs/ojknockout"
], function(ko, $, ReviewQuickRechargeModel, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.mode = ko.observable();
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.confirmScreenDetails = params.rootModel.confirmScreenDetails;
    self.payFrom = ko.observable(params.additionalDetails.account.id.displayValue);
    params.dashboard.headerName(self.resourceBundle.heading.quickRecharge);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("quick-recharge", "bill-payments");
    params.baseModel.registerComponent("pay-bill", "bill-payments");
    params.baseModel.registerComponent("register-biller", "bill-payments");
    params.baseModel.registerComponent("manage-bill-payments", "bill-payments");
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resourceBundle.messages.review;
    self.reviewTransactionName.reviewHeader = self.resourceBundle.messages.reviewQuickRechargeMsg;

    if (params.mode) {
      self.mode(params.mode);
    } else if (self.params.mode) {
      self.mode(self.params.mode);
    }

    self.fillconfirmScreenExtension = function() {
      const confirmScreenDetailsArray = [
        [{
          label: self.resourceBundle.registerBiller.labels.amount,
          value: params.baseModel.formatCurrency(self.quickRechargeDetails.billAmount.amount(), self.quickRechargeDetails.billAmount.currency())
        }, {
          label: self.resourceBundle.registerBiller.labels.paidFrom,
          value: self.quickRechargeDetails.debitAccount.displayValue
        }]
      ];

      if (typeof self.confirmScreenDetails === "function")
        {self.confirmScreenDetails(confirmScreenDetailsArray);}
      else if (self.confirmScreenExtensions) {
        $.extend(self.confirmScreenExtensions, {
          isSet: true,
          taskCode: "EB_F_BP",
          confirmScreenDetails: confirmScreenDetailsArray,
          template: "confirm-screen/bill-payment"
        });
      }
    };

    if (self.mode() !== "REVIEW") {
      self.quickRechargeDetails = ko.mapping.fromJS(self.params.data);
      self.currentAccountType = ko.observable();
      self.billerType = ko.observable();
      self.relationshipDetails = ko.observableArray();

      self.dropdownLabels = {
        category: ko.observable(),
        location: ko.observable(),
        biller: ko.observable(),
        currentAccountType: ko.observable()
      };

      self.currentAccountType(self.quickRechargeDetails.paymentType());
      self.dropdownLabels.currentAccountType(self.quickRechargeDetails.paymentType());
      self.dropdownLabels.category(self.quickRechargeDetails.category());
      self.dropdownLabels.location(self.quickRechargeDetails.location());
      self.dropdownLabels.biller(self.quickRechargeDetails.billerName());

      for (let i = 0; i < self.quickRechargeDetails.billPaymentRelDetails(); i++) {
        self.relationshipDetails.push({
          label: self.quickRechargeDetails.billPaymentRelDetails[i]().labelId(),
          value: self.quickRechargeDetails.billPaymentRelDetails[i]().value()
        });
      }

      self.billerType(self.quickRechargeDetails.billerType());
      self.fillconfirmScreenExtension();
    }

    /**
     * This function redirects to the confirmation screen.
     *
     * @function loadConfirmationScreen
     * @param {Object} jqXhr - Response object.
     * @param {string} transactionName - Name of the transaction.
     * @param {Object} successMessage - Success message to be displayed.
     * @param {arrayList} statusMessages - Transaction status messages.
     * @param {arrayList} confirmScreenDetailsArray - Additional details to be displayed on confirm screen.
     * @returns {void}
     */
    function loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray) {
      params.dashboard.loadComponent("confirm-screen", {
        jqXHR: jqXhr,
        transactionName: transactionName,
        confirmScreenExtensions: {
          successMessage: successMessage,
          statusMessages: statusMessages,
          taskCode: "EB_F_BP",
          isSet: true,
          confirmScreenDetails: confirmScreenDetailsArray,
          template: "confirm-screen/bill-payment"
        }
      }, self);
    }

    self.confirm = function() {
      let successMessage, statusMessages, transactionName;
      const confirmScreenDetailsArray = [
        [{
          label: self.resourceBundle.registerBiller.labels.amount,
          value: params.baseModel.formatCurrency(self.quickRechargeDetails.billAmount.amount(), self.quickRechargeDetails.billAmount.currency())
        }, {
          label: self.resourceBundle.registerBiller.labels.paidFrom,
          value: self.quickRechargeDetails.debitAccount.displayValue
        }]
      ];

      ReviewQuickRechargeModel.quickBillPayment(ko.mapping.toJSON(self.quickRechargeDetails)).done(function(data, status, jqXhr) {
        successMessage = self.resourceBundle.registerBiller.messages.paymentSuccessMessage;
        statusMessages = self.resourceBundle.registerBiller.messages.sucessfull;
        transactionName = self.resourceBundle.heading.quickRecharge;
        loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray);
      });
    };

    self.editPayBill = function() {
      self.currentStage("CREATE");
    };
  };
});

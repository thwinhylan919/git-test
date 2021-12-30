define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/quick-payments",
  "ojs/ojbutton",
  "ojs/ojknockout"
], function(ko, $, ReviewQuickPaymentModel, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.confirmScreenDetails = params.rootModel.confirmScreenDetails;
    params.dashboard.headerName(self.resourceBundle.labels.quickBillPay);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("quick-bill-payment", "bill-payments");
    params.baseModel.registerComponent("pay-bill", "bill-payments");
    params.baseModel.registerComponent("register-biller", "bill-payments");
    params.baseModel.registerComponent("manage-bill-payments", "bill-payments");
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resourceBundle.messages.review;
    self.reviewTransactionName.reviewHeader = self.resourceBundle.messages.reviewQuickPaymentMsg;

    self.fillconfirmScreenExtension = function() {
      const confirmScreenDetailsArray = [
        [{
            label: self.resourceBundle.registerBiller.labels.amount,
            value: params.baseModel.formatCurrency(self.quickBillPayDetails.billAmount.amount(), self.quickBillPayDetails.billAmount.currency())
          },
          {
            label: self.resourceBundle.registerBiller.labels.paidFrom,
            value: self.quickBillPayDetails.debitAccount.displayValue
          }
        ]
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

    if (self.params.mode === "approval") {
      self.currentStage = ko.observable("APPROVAL");
      self.categoryName = ko.observable();
      self.billerType = ko.observable();
      self.relationshipDetails = ko.observableArray();
      self.currentAccountType = ko.observable();
      self.billerType = ko.observable();
      self.quickBillPayDetails = ko.mapping.fromJS(self.params.data);

      ReviewQuickPaymentModel.fetchBillerDetails(self.quickBillPayDetails.billerId()).done(function(response) {
        self.billerType(response.biller.type);
      });

      self.categoryName(self.quickBillPayDetails.category());

      for (let i = 0; i < self.quickBillPayDetails.billPaymentRelDetails(); i++) {
        self.relationshipDetails.push({
          label: self.quickBillPayDetails.billPaymentRelDetails[i]().labelId(),
          value: self.quickBillPayDetails.billPaymentRelDetails[i]().value()
        });
      }

      self.currentAccountType(self.quickBillPayDetails.paymentType());
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
      self.quickBillPayDetails.billerType("QUICK_PAY");

      let successMessage, statusMessages, transactionName;
      const confirmScreenDetailsArray = [
        [{
            label: self.resourceBundle.registerBiller.labels.amount,
            value: params.baseModel.formatCurrency(self.quickBillPayDetails.billAmount.amount(), self.quickBillPayDetails.billAmount.currency())
          },
          {
            label: self.resourceBundle.registerBiller.labels.paidFrom,
            value: self.quickBillPayDetails.debitAccount.displayValue
          }
        ]
      ];

      ReviewQuickPaymentModel.billPayment(ko.mapping.toJSON(self.quickBillPayDetails)).done(function(data, status, jqXhr) {
        successMessage = self.resourceBundle.registerBiller.messages.paymentSuccessMessage;
        statusMessages = self.resourceBundle.registerBiller.messages.sucessfull;
        transactionName = self.resourceBundle.labels.quickBillPay;
        loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray);
      });
    };

    self.editPayBill = function() {
      self.currentStage("CREATE");
    };
  };
});

define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/order-status-mutual-fund",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker"
], function(ko, PurchaseMutualFund, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.action = ko.observable(params.rootModel.params.action);
    self.deleteOrderArray = ko.observable(params.rootModel.params.deleteOrderArray);
    self.instructionId = ko.observable(params.rootModel.params.instructionId);
    self.investmentAccount = ko.observable(params.rootModel.params.investmentAccount);
    self.batchList = ko.observableArray();
    self.resource = resourceBundle;
    self.details = ko.observable();
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("order-status", "mutual-funds");
    params.baseModel.registerComponent("scheme-details-bar", "mutual-funds");
    self.updateMessage = ko.observable(self.resource.purchaseOrder);
    self.disabled = ko.observable(false);

    self.backToOrderStatus =function()
    {
      params.dashboard.loadComponent("order-status", {});
    };

    if (self.action() === "delete-purchase") {
      params.dashboard.headerName(self.resource.purchaseOrder);
    } else if (self.action() === "delete-switch") {
      params.dashboard.headerName(self.resource.swithOrder);
    } else if (self.action() === "delete-redeem") {
      params.dashboard.headerName(self.resource.redeemOrder);
    }

    if (self.action() === "delete-purchase" || self.action() === "delete-redeem") {
      self.details(self.deleteOrderArray().accountHoldingDTO);

    if (self.action() === "delete-purchase") {
      self.updateMessage = ko.observable(self.resource.purchaseOrder);
    } else if (self.action() === "delete-redeem") {
      self.updateMessage = ko.observable(self.resource.redeemOrder);
    }

      self.deleteOrder = function() {
        self.disabled(true);

        PurchaseMutualFund.deleteOrder(self.investmentAccount().value(), self.instructionId()).done(function(data, status, jqXhr) {

          const confirmScreenDetailsArray = [];
          let confirmScreenObj = null;

          confirmScreenObj = {
            header: self.details().scheme.schemeName,
            referenceNumber: data.hostRefId
          };

          confirmScreenDetailsArray.push(confirmScreenObj);
          self.action("delete");

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.updateMessage(),
            confirmScreenExtensions: {
              isSet: true,
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/cancel-mutual-funds",
              resourceBundle: self.resource
            },
            template: "confirm-screen/cancel-mutual-funds-cards"
          });

        });
      };
    } else if (self.action() === "delete-switch") {
      self.details(self.deleteOrderArray());
      self.updateMessage = ko.observable(self.resource.switchOrder);

      self.deleteOrder = function() {
        PurchaseMutualFund.deleteOrder(self.investmentAccount().value(), self.instructionId()).done(function(data, status, jqXhr) {
          const confirmScreenDetailsArray = [];
          let confirmScreenObj = null;

          confirmScreenObj = {
            header: self.details().switchInDetails.scheme.schemeName,
            referenceNumber: data.hostRefId
          };

          confirmScreenDetailsArray.push(confirmScreenObj);
          self.action("delete");

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.updateMessage(),
            confirmScreenExtensions: {
              isSet: true,
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/cancel-mutual-funds",
              resourceBundle: self.resource
            },
            template: "confirm-screen/cancel-mutual-funds-cards"
          });

        });
      };
    }
  };
});

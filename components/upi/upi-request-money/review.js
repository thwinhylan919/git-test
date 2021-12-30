define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/upi-request-money",
  "ojs/ojinputtext",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojknockout",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset"

], function(ko, upiRequestMoneyModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.headers.requestMoney);
    rootParams.baseModel.registerComponent("upi-request-money", "upi");

    self.setExtensions = function(obj) {

      obj.template = "confirm-screen/upi-request-money";
      obj.isSet = true;
      obj.receiverName = self.params.receiverName;
      obj.accountNumber = self.params.accountNumber;

      return obj;
    };

    self.confirmRequest = function() {
      upiRequestMoneyModel.confirmUpiRequestMoney(ko.mapping.toJSON(self.params.modelInstance.upiRequestMoneyDetails)).then(function(data) {

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.nls.headers.requestMoney,
          hostReferenceNumber: data.status.externalReferenceNumber,
          confirmScreenExtensions: self.setExtensions(self.params.confirmScreenExtensions),
          fromPayeeCreation: true,
          resource: self.nls
        }, self);
      });
    };

  };
});

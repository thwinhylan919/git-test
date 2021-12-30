define([
    "knockout",
      "ojL10n!resources/nls/claim-payment",
  "ojs/ojinputnumber",
  "ojs/ojtrain",
  "ojs/ojbutton",
  "ojs/ojinputtext"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);

    rootParams.baseModel.registerElement([
      "row",
      "page-section",
      "confirm-screen"
    ]);

    rootParams.baseModel.registerComponent("security-code-verification", "claim-payment");
    rootParams.baseModel.registerComponent("user-onboarding", "claim-payment");
    rootParams.baseModel.registerComponent("receive-payment", "claim-payment");
    self.resource = ResourceBundle;
    self.aliasType = ko.observable("");
    self.aliasValue = ko.observable("");
    self.paymentId = ko.observable("");
    self.loadComp = ko.observable();
    self.amount=ko.observable("");
    self.currency=ko.observable("");
    rootParams.dashboard.headerName(self.resource.payments.peertopeer.claimPaymentHeader);
    self.loadComp("security-code-verification");
  };
});
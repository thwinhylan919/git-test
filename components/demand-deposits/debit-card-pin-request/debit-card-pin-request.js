define([
    "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/debit-card-pin-request",
  "ojs/ojknockout",
  "ojs/ojinputnumber",
  "ojs/ojbutton"
], function(ko, $, RequestPinModel, resourceBundle) {
  "use strict";

  return function(Params) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = RequestPinModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      };

    ko.utils.extend(self, Params.rootModel);
    self.cardObject = self.params;
    self.data = ko.observable(Params.rootModel.viewDetailsData);
    self.locale = resourceBundle;
    self.common = self.locale.common;
    self.localModeOfdelivery = ko.observable();
    self.reviewEnable = ko.observable(false);
    self.validationTracker = ko.observable();
    self.serviceId = ko.observable();
    self.loadConfirm = ko.observable(false);
    self.rootModelInstance = getNewKoModel();
    self.addressDetails = self.previousState ? self.previousState.addressDetails : ko.mapping.fromJS(self.rootModelInstance.addressDetails);
    self.payload = self.rootModelInstance.payload;
    self.accountId = self.cardObject.accountId.value;
    self.cardNo = self.cardObject.cardNo.value;
    self.srNo = ko.observable();
    self.CardDetailsData = ko.observable();
    self.debitCardDetailsObject = ko.observable(self.params);
    Params.dashboard.headerName(self.locale.compName.debitCardPinRequest);
    self.CardDetailsData(self.cardObject);

    self.reviewTransactionName = {
      header: self.locale.review,
      reviewHeader: self.locale.reviewHeader
    };

    Params.baseModel.registerComponent("review-debit-card-pin-request", "demand-deposits");
    Params.baseModel.registerElement("address");

    self.review = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      const context = {};

      context.mode = "REVIEW";
      context.addressDetails = self.addressDetails;
      context.accountId = self.accountId;
      context.cardNo = self.cardNo;
      Params.dashboard.loadComponent("review-debit-card-pin-request", context);
    };

    self.redirect = function() {
      window.location.href = "demand-deposits.html";
    };

    self.showFloatingPanel = function() {
      $("#panelDebitCard")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };
  };
});

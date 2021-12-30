define([
  "ojL10n!resources/nls/review-upi-pending-request",
  "./model",
  "knockout",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojbutton"
], function(resourceBundle, Model, ko) {
  "use strict";

  return function(params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.componentHeader);

    const getNewKoModel = function() {
      const KoModel = Model.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();

    self.reviewData = params.rootModel.params.data;
    params.baseModel.registerComponent("upi-pending-request", "upi");

    self.payloadData = {
      amount: params.rootModel.params.data.amount,
      valueDate: null,
      debitVPAId: params.rootModel.params.data.debitVPAId,
      creditVPAId: params.rootModel.params.data.creditVPAId,
      remarks: params.rootModel.params.data.remarks,
      sourceAccount: params.rootModel.params.data.account,
      deviceDetails: params.rootModel.params.data.deviceDetails
    };

    params.baseModel.registerElement(["confirm-screen"]);
    self.confirmScreenExtensions = self.reviewData;
    self.confirmScreenExtensions.template = "confirm-screen/upi-pending-request";
    self.confirmScreenExtensions.isSet = true;

    self.onClickConfirm73=function() {
      Model.paymentstransfersupipost(params.rootModel.params.data.transferId).then(function(response) {
        params.dashboard.loadComponent("confirm-screen", {
          transactionResponse: response,
          transactionName: self.nls.componentHeader,
          confirmScreenExtensions: self.confirmScreenExtensions,
          resource: self.nls
        });
      });
    };

    self.onClickBack86=function() {
      history.back();
    };

  };
});

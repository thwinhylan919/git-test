define([
  "knockout",
  "ojL10n!resources/nls/review-file-identifier"
], function (ko, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.Nls = resourceBundle.reviewFileIdentifier;
    ko.utils.extend(self, rootParams.rootModel.params);
    rootParams.dashboard.headerName(self.Nls.fIMaintenance);
    self.fiRegistrationPayload = ko.mapping.fromJS(self.data);

    self.back = function () {
      history.go(-1);
    };

    self.submit = function () {
      let partyId = null;

      if (self.partyDetail) {
        partyId = self.fiRegistrationPayload.partyId();
      } else {
        partyId = "ADMIN";
      }

      const fiRegistrationPayload = ko.toJSON(self.data);

      self.FiRegistrationModel.registerFiPayment(fiRegistrationPayload, partyId).done(function (data, status, jqXhr) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.Nls.transactionName
        }, self);
      });
    };
  };

});
define([
  "knockout",
  "ojL10n!resources/nls/otp-preference",
  "ojs/ojradioset"
], function (ko, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.myProfile);
    self.dataLoaded = ko.observable(false);

    if (rootParams.rootModel.payload) {
      self.payload = rootParams.rootModel.payload;
      self.dataLoaded(true);
    }

    self.otpDeliveryModeSelected = function () {
      delete self.payload.status;
      rootParams.rootModel.preferenceUpdate(self.payload);
    };

  };
});
define([
  "knockout",
  "ojL10n!resources/nls/feedback-preference",
  "ojs/ojswitch"
], function (ko, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.settings);
    self.dataLoaded = ko.observable(false);

    if (rootParams.rootModel.payload) {
      self.payload = rootParams.rootModel.payload;
      self.dataLoaded(true);
    }

    self.feedbackEnabledChange = function () {
      delete self.payload.status;
      rootParams.rootModel.preferenceUpdate(self.payload);
    };

  };
});
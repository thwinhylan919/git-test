define([
  "knockout",
  "./model",
  "ojs/ojswitch"
], function (ko, GenericSettingsModel) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.dataLoaded = ko.observable(false);

    rootParams.baseModel.registerComponent("device-unbinding", "security");
    rootParams.baseModel.registerComponent("push-unbinding", "security");
    rootParams.baseModel.registerComponent("wearable-device-unbinding", "security");
    rootParams.baseModel.registerComponent("feedback-preference", "feedback");
    rootParams.baseModel.registerComponent("oracle-live-preference", "security");
    rootParams.baseModel.registerComponent("otp-preference", "security");

    GenericSettingsModel.getPreference().then(function (data) {
      self.payload = ko.mapping.fromJS(data);
      self.dataLoaded(true);
    });

    self.preferenceUpdate = function (data) {
      self.payload = ko.toJS(data);
      GenericSettingsModel.updatePreference(ko.mapping.toJSON(self.payload));
    };

  };
});
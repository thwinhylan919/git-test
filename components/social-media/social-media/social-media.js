define([
  "knockout",
  "ojL10n!resources/nls/social-media"
], function (ko, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.id = rootParams.id ? rootParams.id : 1;
    self.callback = rootParams.callback;
    self.api = rootParams.api || "USER_PROFILE";
    self.customAPI = rootParams.customAPI;
    self.autoLogin = rootParams.autoLogin || false;
    self.resetState = rootParams.resetState || true;
    self.type = rootParams.social_media_type;

    if (rootParams.baseModel.cordovaDevice() && self.type === "facebook") {
      self.type = self.type + "-mobile";
    }

    rootParams.baseModel.registerComponent(self.type, "social-media");
  };
});
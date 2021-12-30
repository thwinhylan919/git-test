define([
    "knockout",
      "ojL10n!resources/nls/user-login-configuration",
    "ojs/ojknockout"
  ], function(ko, resourceBundle) {
    "use strict";

    return function(params) {
      const self = this;

      ko.utils.extend(self, params.rootModel);
      self.nls = resourceBundle;

    };
  });
define([
  "knockout",
    "ojL10n!resources/nls/help-box"
], function(ko, locale) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = locale;
  };
});
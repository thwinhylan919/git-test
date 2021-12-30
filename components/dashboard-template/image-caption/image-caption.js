define([
    "knockout",
    "ojL10n!resources/nls/design-dashboard-component-name"
], function(ko, nls) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = nls;
    self.data = params.data;
  };
});
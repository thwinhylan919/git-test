define([
    "knockout",
    "ojL10n!resources/nls/card-pay"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.dashboard.headerName(self.resource.pay.cardHeading);
  };
});

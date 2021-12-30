define([
    "knockout",
    "ojL10n!resources/nls/request-pin"
], function(ko, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.requestPin.cardHeading);
  };
});
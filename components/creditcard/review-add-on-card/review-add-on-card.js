define([
    "knockout",
    "ojL10n!resources/nls/add-on-card"
], function(ko,ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, Params.rootModel);
    Params.dashboard.headerName(Params.rootModel.params.cardHeading);
  };
});

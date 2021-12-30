define([
    "knockout",
    "ojL10n!resources/nls/cancel-card"
], function(ko, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

self.resource = ResourceBundle;

    self.reviewTransactionName = {
      header: self.resource.cancelCard.review,
      reviewHeader: self.resource.cancelCard.reviewHeading
    };

    self.resource = ResourceBundle;
    ko.utils.extend(self, Params.rootModel);
    Params.dashboard.headerName(self.resource.cancelCard.cardHeading);
  };
});

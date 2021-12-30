define([

  "knockout",
  "ojL10n!resources/nls/auto-pay"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.dashboard.headerName(self.resource.autopay.cardHeading);
    self.loadScreen = ko.observable(false);

    self.reviewTransactionName = {
      header: self.resource.autopay.reviewHeader,
      reviewHeader: self.resource.autopay.reviewHeading
    };

    if (self.params.currentActionType === "dereg") {
      self.reviewTransactionName.reviewHeader = self.resource.autopay.reviewHeading2;
    }

    self.loadScreen(true);
  };
});

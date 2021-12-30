define([

  "knockout",
  "ojL10n!resources/nls/block-card"
], function(ko, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, Params.rootModel);
    Params.dashboard.headerName(self.resource.blockCard.cardHeading);

    self.reviewTransactionName = {
      header: self.resource.blockCard.review,
      reviewHeader: ""
    };

    if (self.params.replaceConfirmationType === "OPTION_YES") {
      self.reviewTransactionName.reviewHeader = self.resource.blockCard.reviewReplaceHeading;
    } else {
      self.reviewTransactionName.reviewHeader = self.resource.blockCard.reviewHeading;
    }
  };
});

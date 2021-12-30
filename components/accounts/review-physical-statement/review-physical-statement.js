define([
    "knockout",
    "ojL10n!resources/nls/review-physical-statement"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.accountActivity.statement);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resource.common.review;
    self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;
  };
});
define([

  "knockout",

  "ojL10n!resources/nls/review-dashboard-mapping", "./model"
], function (ko, nls, model) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = nls;
    params.dashboard.headerName(self.nls.pageHeader);
    self.payload = {};
    ko.utils.extend(self.payload, self.params.data);
    self.payload.dashboardId = self.params.data.dashboardId.split("_")[0];
    self.templateName = self.params.data.dashboardId.split("_")[1];
    params.baseModel.registerElement("page-section");
    params.baseModel.registerElement("row");
    params.baseModel.registerElement("confirm-screen");

    self.saveMapping = function () {
      model.createMapping(JSON.stringify(self.payload)).then(function (data, status, jqXhr) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transaction: self.nls.header
        }, self);
      });
    };

    self.reviewTransactionName = {};
    self.reviewTransactionName.header = self.nls.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.nls.reviewMapping;
  };
});
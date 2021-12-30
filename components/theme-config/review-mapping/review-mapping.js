define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/review-brand-mapping"
], function (ko, model, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.payload = ko.mapping.toJS(rootParams.rootModel.params.data);
    self.type = rootParams.rootModel.params.type;
    self.mode = rootParams.rootModel.params.mode;
    self.locale = locale;
    rootParams.dashboard.headerName(self.locale.pageHeader);

    self.saveMapping = function () {
      model.createMapping(JSON.stringify(self.payload)).then(function (data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse:data,
          transactionName: self.locale.createHeader
        }, self);
      });
    };

    self.deleteMapping = function () {
      model.deleteMapping(self.payload.mappedType, self.payload.mappedValue).then(function (data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse:data,
          transactionName: self.locale.deleteHeader
        }, self);
      });
    };

    self.reviewTransactionName = {};
    self.reviewTransactionName.header = self.locale.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.locale.reviewMapping;
  };
});
define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/api-group-review",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojbutton",
  "ojs/ojknockout-validation"
], function (ko, APIGroupReviewModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerComponent("api-group-create", "api-builder");
    rootParams.baseModel.registerComponent("api-group-edit", "api-builder");
    rootParams.baseModel.registerElement("confirm-screen");
    self.resource = resourceBundle;
    rootParams.dashboard.headerName(self.resource.headerName);
    self.reviewMode = ko.observable(rootParams.rootModel.params.mode());
    self.apiGroupDTO = ko.observable(rootParams.rootModel.params.apiGroupDTO);

    self.onClickBack = function () {
      if (self.reviewMode() === "CREATE") {
        rootParams.dashboard.loadComponent("api-group-create", rootParams.rootModel.params);
      } else {
        rootParams.dashboard.loadComponent("api-group-edit", rootParams.rootModel.params);
      }
    };

    self.confirm = function () {
      if (self.reviewMode() === "CREATE") {
        APIGroupReviewModel.createApiGroup(ko.toJSON(self.apiGroupDTO())).done(function (data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.resource.transactionName,
            referenceNumber: jqXhr.responseJSON.referenceNumber
          }, self);
        });
      } else {
        APIGroupReviewModel.updateApiGroup(ko.toJSON(self.apiGroupDTO())).done(function (data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.resource.transactionName,
            referenceNumber: jqXhr.responseJSON.referenceNumber
          }, self);
        });
      }
    };
  };
});
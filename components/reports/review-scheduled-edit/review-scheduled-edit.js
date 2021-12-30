define([
    "knockout",
    "ojL10n!resources/nls/review-scheduled-edit",
  "./model",
  "ojs/ojinputtext"
], function(ko, resourceBundle, Model) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.scheduledEdit = self.params.scheduledEdit;
    self.Nls = resourceBundle.reportList;
    rootParams.dashboard.headerName(self.Nls.scheduledReports);
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerComponent("scheduled-reports-edit", "reports");
    rootParams.baseModel.registerComponent("report-generation", "reports");

    self.cancel = function() {
      rootParams.dashboard.hideDetails();
    };

    self.loadScheduledList = function() {
      rootParams.dashboard.loadComponent("report-generation");
    };

    self.confirm = function() {
      const payload = ko.mapping.toJSON(self.scheduledEdit);

      Model.updateScheduledEdit(payload).then(function(data, status, jqXHR) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: self.Nls.transactionName,
          template: "report/edit-scheduled-reports-confirm-screen"
        }, self);
      });
    };
  };
});
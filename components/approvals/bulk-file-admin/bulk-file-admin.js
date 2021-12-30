define([
  "ojs/ojcore",
  "knockout",
  "./model",

  "ojL10n!resources/nls/bulk-file-admin",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function(oj, ko, activityLogModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle;
    rootParams.baseModel.registerComponent("transaction-detail", "admin-approvals");
    self.transactionListLoaded = ko.observable(false);

    let transactionList;

    activityLogModel.getTransactionList(rootParams.rootModel.view, rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").done(function(data) {
      transactionList = data.transactionDTOs;

      self.arrayDataSource = new oj.ArrayTableDataSource(transactionList || [], {
        idAttribute: "fileRefId"
      });

      self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);
      self.transactionListLoaded(true);
    });
  };
});
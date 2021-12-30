define([
  "ojs/ojcore",
  "knockout",
    "./model",
    "ojL10n!resources/nls/session-summary",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, SessionSummaryDetailsModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.txnDataLoaded = ko.observable(false);

    SessionSummaryDetailsModel.getDetails(rootParams.data.sessionId).done(function(data) {
      self.datasource = new oj.ArrayTableDataSource(data.auditList, {
        idAttribute: "id"
      });

      self.paginationDataSource = new oj.PagingTableDataSource(new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(data.auditList))));
      self.txnDataLoaded(true);
    });
  };
});
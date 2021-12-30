define([
  "ojs/ojcore",
  "knockout",
  "jquery",
      "ojL10n!resources/nls/mailers",
  "ojs/ojinputtext",
  "ojs/ojarraytabledatasource",
  "ojs/ojtable"
], function(oj, ko, $, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.data = rootParams.dataSource;

    self.createDataSource = function() {
      const bulletinData = $.map(self.data, function(val) {
        val.ID = val.messageId.displayValue;
        val.description = val.description ? val.description : "-";

        return val;
      });

      self.paginationDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(bulletinData, {
        idAttribute: "ID"
      }));

      self.mailersListFetched(true);
    };

    rootParams.baseModel.registerComponent("view", "mailers");
    self.createDataSource();

    self.onMailerSelected = function(data) {
      let context = {};

      context = data;
      context.mode = "VIEW";

      rootParams.dashboard.loadComponent("view", {
        context:context,
        searchFlag : self.searchFlag
      });
    };
  };
});
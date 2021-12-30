define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/session-summary",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojrowexpander",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource",
  "ojs/ojflattenedtreetabledatasource",
  "ojs/ojjsontreedatasource"
], function(oj, ko, $, SessionSummaryModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.dataLoaded = ko.observable(false);
    self.toggleSummaryDetails = ko.observable(false);
    rootParams.dashboard.headerName(self.nls.header.sessionSummary);
    rootParams.baseModel.registerComponent("session-summary-details", "base-components");

    SessionSummaryModel.getDetails().done(function(data) {
      self.sessionData = $.map(ko.utils.unwrapObservable(data.userSessionDTOList), function(val) {
        val.attr = {
          creationDate: val.creationDate,
          lastUpdatedDate: val.lastUpdatedDate,
          channel: self.nls.channelType[[val.accessPointId]],
          ipAddress: val.ipAddress,
          sessionId: val.sessionId,
          isVisible: ko.observable(false)
        };

        val.children = [{
          attr: {
            sessionId: val.sessionId
          }
        }];

        return val;
      });

      self.paginationDataSource = new oj.PagingTableDataSource(new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.sessionData))));
      self.dataLoaded(true);
    });

    self.showSesionDetails = function(data) {
      data.isVisible(true);
      $("#block_" + data.id).show();
      $("#blockdetails_" + data.id).show();
      $("#blocktoshow_" + data.id).hide();
    };

    self.hideSesionDetails = function(data) {
      data.isVisible(false);
      $("#block_" + data.id).hide();
      $("#blockdetails_" + data.id).hide();
      $("#blocktoshow_" + data.id).show();
    };
  };
});
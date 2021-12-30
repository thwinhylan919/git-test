define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/resource-server-review",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojlistview",
  "ojs/ojpopup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(ko, $, RSReviewModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("confirm-screen");
    self.Nls = resourceBundle.resourceServerReview;
    self.firstVisit = self.params.firstVisit || ko.observable(true);
    self.resourceServerPayloadToSend = self.params.resourceServerPayloadToSend || {};
    self.resourceServerPayload = self.params.resourceServerPayload || {};
    rootParams.dashboard.headerName(self.Nls.resoureServerMt);
    self.sendResServerId = self.params.sendResServerId || ko.observable();

    self.confirmCreate = function() {
      const resourceSerPayload = ko.toJSON(self.resourceServerPayloadToSend);

      RSReviewModel.resourceServerCreate(resourceSerPayload).done(function(data, status, jqXhr) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.Nls.resoureServerMt,
          template: "oauth/confirm-screen-template"
        }, self);
      });
    };

    self.confirmUpdate = function() {
      const resourceSerPayload = ko.toJSON(self.resourceServerPayloadToSend);

      RSReviewModel.resourceServerUpdate(resourceSerPayload).done(function(data, status, jqXhr) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.Nls.resoureServerMt,
          template: "oauth/confirm-screen-template"
        }, self);
      });
    };

    self.cancel = function() {
      $("#reviewCancel").trigger("openModal");
    };

    self.back = function() {
      self.firstVisit(false);
      self.resourceServerPayload.scopes.removeAll();
      history.go(-1);
    };

    self.no = function() {
      $("#reviewCancel").hide();
    };
  };
});
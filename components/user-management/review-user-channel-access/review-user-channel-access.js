define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/user-search-list",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojswitch"
], function(ko, ReviewUserChannelAccessModel, resourceBundle) {
  "use strict";

  return function viewModel(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.userSearchResponse = ko.observable();
    self.nls = resourceBundle;

    if (rootParams.rootModel.params && rootParams.rootModel.params.data) {
      self.userSearchResponse(ko.toJS(rootParams.rootModel.params.data));
      self.channelAccessValue = ko.observable(self.userSearchResponse().deleteStatus);
      self.deleteReason = ko.observable(self.userSearchResponse().deleteReason);
    } else {
      self.userSearchResponse = ko.observable(rootParams.rootModel.params.selectedUserDetail);
      self.channelAccessValue = ko.observable(rootParams.rootModel.params.deleteStatus);
      self.deleteReason = ko.observable(rootParams.rootModel.params.reason);
    }

    if (self.channelAccessValue()) {
      self.userChannelAccess = ko.observable(self.nls.header.revoked);
    } else {
      self.userChannelAccess = ko.observable(self.nls.header.granted);
      self.deleteReason = ko.observable("");
    }

    rootParams.baseModel.registerElement("confirm-screen");

    self.confirm = function() {
      if (self.channelAccessValue()) {
        let payload = {};

        if (self.deleteReason() !== "")
          {payload = { deleteReason: self.deleteReason() };}

      ReviewUserChannelAccessModel.deleteUser(self.userSearchResponse().username, ko.toJSON(payload)).done(function(data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.nls.header.userChannelAccess
        }, self);
      });
    }
    else {
      ReviewUserChannelAccessModel.grantUser(self.userSearchResponse().username).done(function (data, status, jqXhr) {

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.header.userChannelAccess
        }, self);
      });
    }
    };
  };
});
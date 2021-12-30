define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/user-search-list",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojswitch"
], function (ko, ReviewUserStatusModel, resourceBundle) {
  "use strict";

  return function viewModel(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.searchedResultResponse = ko.observable();

    if (rootParams.rootModel.params && rootParams.rootModel.params.data) {
      self.searchedResultResponse(ko.toJS(rootParams.rootModel.params.data));

      if (rootParams.rootModel.params.data.lockStatus === "LOCK") { self.reviewstatusOptionValue = ko.observable(true); }
      else {
        self.reviewstatusOptionValue = ko.observable(false);
      }

      self.lockStatusValue = ko.observable(rootParams.rootModel.params.data.lockStatus);
    } else {
      self.searchedResultResponse = rootParams.rootModel.params.selectedUserData;
      self.reviewstatusOptionValue = ko.observable(rootParams.rootModel.params.statusOptionValueNew());
      self.lockStatusValue = ko.observable(rootParams.rootModel.params.statusOptionValue());
      self.lockReason = ko.observable(rootParams.rootModel.params.reason());
    }

    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("confirm-screen");

    self.confirm = function () {
      if (self.lockStatusValue().toUpperCase() === "LOCKED") {
        const payload = {
          lockReason: self.lockReason()
        };

        ReviewUserStatusModel.lockStatus(self.searchedResultResponse().username, ko.toJSON(payload)).done(function (data) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.header.lockStatus
          });
        });
      } else {
        ReviewUserStatusModel.unlockStatus(self.searchedResultResponse().username).done(function (data) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.header.lockStatus
          });
        });
      }
    };
  };
});
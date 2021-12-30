define([
  "knockout",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/rules",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function(ko, PartyValidateModel, Constants, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("rules-create", "approvals");
    rootParams.baseModel.registerComponent("rules-search", "approvals");
    self.actionHeaderheading = ko.observable(self.nls.rules.ruleMaintainance);
    self.initiatorType = ko.observable();
    self.createWorkflow = ko.observable();
    self.searchWorkflow = ko.observable();
    self.partyDetailsFromApprovalNavBar = {};
    self.flag = ko.observable(false);

    PartyValidateModel.fetchMe().then(function(data) {
      if (Constants.userSegment === "CORPADMIN") {
        if (data.userProfile.partyId.displayValue) {
          self.partyDetailsFromApprovalNavBar.value = data.userProfile.partyId.value;
          self.partyDetailsFromApprovalNavBar.displayValue = data.userProfile.partyId.displayValue;
          self.flag(true);
        }
      }
      else {
        self.flag(true);
      }
    });
  };
});
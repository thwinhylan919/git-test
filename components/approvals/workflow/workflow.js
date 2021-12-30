define([
  "knockout",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/workflow",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function(ko, PartyValidateModel, Constants, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.workflow.workflowDetails);
    rootParams.baseModel.registerComponent("workflow-create", "approvals");
    rootParams.baseModel.registerComponent("workflow-search", "approvals");
    rootParams.baseModel.registerComponent("workflow-list", "approvals");
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("party-validate", "common");
    self.actionHeaderheading = ko.observable(self.nls.headers.workflowMaintenance);
    self.createWorkflow = ko.observable();
    self.searchWorkflow = ko.observable();

    const getNewKoModel = function() {
      const KoModel = PartyValidateModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.partyDetailsFromApprovalNavBar = {
      value: null,
      displayValue: null
    };

    self.flag = ko.observable(false);

    PartyValidateModel.fetchMe().then(function (data) {
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

    self.rootModelinstance = ko.observable(getNewKoModel());
    self.partyDetails = self.rootModelinstance().approvals;

    self.fetchPartyDetails = function() {
      self.partyDetails.partyDetailsFetched(false);

      PartyValidateModel.fetchDetails(self.partyDetails.partyId()).then(function(data) {
        self.partyDetails.partyId(data.party.id.value);
        self.partyDetails.partyName(data.party.personalDetails.fullName);
        self.partyDetails.partyDetailsFetched(true);
      });
    };
  };
});
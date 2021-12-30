define([
    "knockout",
      "./model",
  "ojL10n!resources/nls/user-group",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function(ko, PartyValidateModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
    rootParams.baseModel.registerComponent("user-group-list", "approvals");
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("party-validate", "common");
    self.loadPartyValidate = ko.observable(true);
    self.createWorkflow = ko.observable();
    self.searchWorkflow = ko.observable();

    const getNewKoModel = function() {
      const KoModel = PartyValidateModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

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
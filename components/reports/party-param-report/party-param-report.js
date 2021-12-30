define([
    "knockout",
    "ojL10n!resources/nls/party-param-report",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function(ko, resourceBundle, Constants) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.partyParam;
        self.validationTracker = rootParams.validationTracker;
        self.partyDetailsFetched = ko.observable(false);
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.userType = ko.observable();
        self.userType(rootParams.dashboard.appData.segment);

        if (rootParams.dashboard.userData.userProfile.partyId.displayValue) {
            for (let i = 0; i < rootParams.dashboard.userData.userProfile.accessibleEntityDTOs.length; i++) {
                if (rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[i].entityId === Constants.currentEntity) {
                    self.partyId(rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[i].userPartyRelationship.partyId.displayValue);
                    self.partyName(rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[i].partyName);
                    self.partyDetailsFetched(true);
                }
            }
        }
    };
});
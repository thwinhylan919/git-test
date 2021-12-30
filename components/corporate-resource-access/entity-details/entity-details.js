define([
    "ojL10n!resources/nls/entity-details",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function (resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.partyId = params.partyId;
        self.partyName = params.partyName;
        self.moduleName = params.moduleName;
        self.userData = params.userData;
        self.isUserSelected = params.isUserSelected;
    };
});
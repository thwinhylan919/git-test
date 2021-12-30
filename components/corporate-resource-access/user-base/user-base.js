define([
        "ojL10n!resources/nls/user-base",
        "./model",
        "knockout",
        "ojs/ojformlayout",
        "ojs/ojvalidationgroup",
        "ojs/ojbutton"
    ],
    function (resourceBundle, Model, ko) {
        "use strict";

        return function (params) {
            const self = this;

            self.nls = resourceBundle;
            params.dashboard.headerName(self.nls.componentHeader);

            self.readAttributeAccess = Model.readUserAttributeAccess;

            self.partyDetails = {};

            let party = {};

            self.partyDetailsFetched = ko.observable(params.rootModel.params.partyDetailsFetched ? params.rootModel.params.partyDetailsFetched : false);
            self.partyAdditionalDetails = ko.observable();
            self.partyName = ko.observable(params.rootModel.params.partyName ? params.rootModel.params.partyName : "");
            self.partyFirstName = ko.observable();
            self.partyLastName = ko.observable();
            self.isUsersFetched = ko.observable(false);
            self.hideValidate = ko.observable(params.rootModel.params.hideValidate ? params.rootModel.params.hideValidate : false);
            self.isModuleSelected = ko.observable(params.rootModel.params.isModuleSelected ? params.rootModel.params.isModuleSelected : false);
            self.selectedModule = ko.observable();
            self.isUserSelected = ko.observable(params.rootModel.params.isUserSelected ? params.rootModel.params.isUserSelected : false);
            self.userData = ko.observable();
            self.cameBack = params.rootModel.params.cameBack ? params.rootModel.params.cameBack : false;
            self.accessLevel = "USER";
            self.value = ko.observable(params.dashboard.userData.userProfile.partyId.value ? params.dashboard.userData.userProfile.partyId.value : null);
            self.displayValue = ko.observable(params.dashboard.userData.userProfile.partyId.displayValue ? params.dashboard.userData.userProfile.partyId.displayValue : null);

            if (self.partyDetailsFetched() && self.cameBack) {
                self.displayValue = ko.observable(params.rootModel.params.partyId);
                self.value = ko.observable(params.rootModel.params.value);
                self.selectedModule(params.rootModel.params.selectedModule);
                self.userData(params.rootModel.params.userData);
                self.isUserSelected(params.rootModel.params.isUserSelected);
            }

            party = {
                value: self.value,
                displayValue: self.displayValue
            };

            if (!self.cameBack && params.dashboard.appData.segment === "CORPADMIN") {
                Model.mepartygetCall().then(function (data) {
                    self.partyName(data.party.personalDetails.fullName);
                    self.hideValidate(true);
                    self.partyDetailsFetched(true);
                });

            }

            self.partyDetails = {
                party: party,
                partyDetailsFetched: self.partyDetailsFetched,
                partyName: self.partyName,
                partyLastName: self.partyLastName,
                partyFirstName: self.partyFirstName,
                partyAdditionalDetails: self.partyAdditionalDetails
            };

            params.baseModel.registerComponent("party-validate", "common");
            params.baseModel.registerComponent("user-list-resource-access", "corporate-resource-access");
            params.baseModel.registerComponent("mapping-summary-details", "corporate-resource-access");

            self.onClickCancel36 = function () {
                params.dashboard.loadComponent(self.homeComponent, {});
            };

            self.onClickBack = function () {
                if (params.dashboard.appData.segment === "CORPADMIN") {
                    self.hideValidate(true);
                } else if (self.isUserSelected()) {
                    self.hideValidate(true);
                } else {
                    self.hideValidate(false);
                    self.partyName("");
                    self.partyDetailsFetched(false);
                    self.partyFirstName("");
                    self.partyLastName("");
                    self.partyAdditionalDetails("");
                    self.partyDetails.party.value("");
                    self.isModuleSelected(false);
                    self.selectedModule("");
                }

                self.isUserSelected(false);
            };
        };
    });
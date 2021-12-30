define([
    "ojL10n!resources/nls/module-search",
    "./model",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojlabel"
], function (resourceBundle, Model, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.isModuleSelected = params.isModuleSelected;
        self.isPartyFetched = ko.observable(params.isPartyFetched);
        self.moduleList = ko.observableArray();
        self.selectedModule = params.selectedModule;
        self.isModuleFetched = ko.observable(false);
        self.hideValidate = ko.observable(params.hideValidate);
        self.partyId = ko.observable(params.partyDetails.party.displayValue());
        self.partyName = ko.observable(params.partyDetails.partyName());
        self.userData = params.userData;
        self.isUserSelected = params.isUserSelected ? params.isUserSelected : ko.observable(false);

        function enumerationsaccessModulegetCall() {
            return Model.enumerationsaccessModuleget();
        }

        self.ModuleName9ValueChange = function(event) {
            const value = event.detail.value;

            self.isModuleSelected(false);
            ko.tasks.runEarly();

            if (value && value.code !== "") {
                self.isModuleSelected(true);
            }
        };

        enumerationsaccessModulegetCall().then(function (response) {
            self.moduleList(response.enumRepresentations[0].data);
            self.isModuleFetched(true);
            ko.tasks.runEarly();

            if (!self.selectedModule()) {
                self.selectedModule(self.moduleList()[0]);
            }
        });

        if (self.isPartyFetched()) {
            self.hideValidate(true);
        }
    };
});
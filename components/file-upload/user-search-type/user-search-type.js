define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/user-search-type",
    "./model",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist",
    "ojs/ojradioset"
], function(ko, $, resourceBundle, Model) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("user-search", "file-upload");
        rootParams.baseModel.registerComponent("user-search-admin", "file-upload");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.user);
        self.mappingType = ko.observable();

        Model.fetchMe().done(function(partyId) {
            if (partyId.userProfile.partyId.displayValue) {
                self.isAdmin(false);
                self.loadCorporateComponent();
            } else {
                self.isAdmin(true);
            }
        });

        self.showModal = function() {
            $("#choicePopup").trigger("openModal");
        };

        self.closeHandler = function() {
            rootParams.dashboard.switchModule();
        };

        self.MappingTypeSelected = function() {
            if (self.mappingType().toUpperCase() === "ADMINUSER") {
                rootParams.dashboard.loadComponent("user-search-admin", {});
            } else if (self.mappingType().toUpperCase() === "CORPORATEUSER") {
                rootParams.dashboard.loadComponent("user-search", {});
            }
        };
    };
});
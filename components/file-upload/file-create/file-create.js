define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/file-create",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist",
    "ojs/ojradioset"
], function (ko, $, resourceBundle, Model) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("file-identifier-search", "file-upload");
        rootParams.baseModel.registerComponent("file-admin-create", "file-upload");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.fileCreate.create);
        self.userType = ko.observable();

        Model.fetchMe().done(function (partyId) {
            if (partyId.userProfile.partyId.displayValue) {
                self.isAdmin(false);
                self.loadCorporateComponent();
            } else {
                self.isAdmin(true);
            }
        });

        self.showModal = function () {
            $("#choicePopup").trigger("openModal");
        };

        self.closeHandler = function () {
            rootParams.dashboard.switchModule();
        };

        self.userTypeSelected = function () {
            if (self.userType().toUpperCase() === "ADMINUSER") {
                rootParams.dashboard.loadComponent("file-admin-create", {});
            } else if (self.userType().toUpperCase() === "CORPORATEUSER") {
                rootParams.dashboard.loadComponent("file-identifier-search", {});
            }
        };
    };
});
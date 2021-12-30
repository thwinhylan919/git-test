define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/approvals",
    "./model",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist"
], function(ko, $, resourceBundle, Model) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("user-group", "approvals");
        rootParams.baseModel.registerComponent("admin-user-group", "admin-approvals");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.pageTitle.approvals);
        self.partyDetailsFromApprovalNavBar = {};
        self.showChoicePopup = ko.observable(true);
        self.approvalUser = ko.observable();
        self.menuSelection = ko.observable();
        self.party = ko.observable();
        self.mode = ko.observable("APPROVALREVIEW");

        Model.fetchMe().then(function(partyId) {
            if (partyId.userProfile.partyId.displayValue) {
                self.partyDetailsFromApprovalNavBar.value = partyId.userProfile.partyId.value;
                self.partyDetailsFromApprovalNavBar.displayValue = partyId.userProfile.partyId.displayValue;
                self.loadCorporateComponent();
                self.isAdmin(false);
            } else {
                self.isAdmin(true);
            }
        });

        self.keepCheck = ko.observable(false);

        self.showModal = function() {
            $("#choicePopup").trigger("openModal");
            self.keepCheck(true);
        };

        self.closeHandler = function() {
            rootParams.dashboard.switchModule();
        };

        self.loadAdminComponent = function() {
            self.approvalUser("AdminUser");
            self.keepCheck(false);

            rootParams.dashboard.loadComponent("admin-user-group", {
                approvalUser: ko.toJS(self.approvalUser)
            });
        };

        self.loadCorporateComponent = function() {
            self.approvalUser("CorporateUser");
            self.keepCheck(false);

            rootParams.dashboard.loadComponent("user-group", {
                approvalUser: ko.toJS(self.approvalUser),
                partyDetailsFromApprovalNavBar: ko.toJS(self.partyDetailsFromApprovalNavBar)
            });
        };
    };
});
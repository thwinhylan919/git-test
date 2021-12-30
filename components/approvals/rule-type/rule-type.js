define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/approvals",
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
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("rules", "approvals");
        rootParams.baseModel.registerComponent("rules-admin", "admin-approvals");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.pageTitle.approvals);

        self.partyDetailsFromApprovalNavBar = {
            value: null,
            displayValue: null
        };

        self.ruleType = ko.observable();
        self.showChoicePopup = ko.observable(true);
        self.approvalUser = ko.observable();
        self.menuSelection = ko.observable();
        self.party = ko.observable();
        self.mode = ko.observable("APPROVALREVIEW");

        Model.fetchMe().then(function(data) {
            if (data.userProfile.partyId.displayValue) {
                self.partyDetailsFromApprovalNavBar.value = data.userProfile.partyId.value;
                self.partyDetailsFromApprovalNavBar.displayValue = data.userProfile.partyId.displayValue;
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

        self.ruleTypeSelected = function(event) {
            if (event.detail.value === "AdminUser") {
                self.approvalUser("AdminUser");
                self.keepCheck(false);

                rootParams.dashboard.loadComponent("rules-admin", {
                    approvalUser: ko.toJS(self.approvalUser)
                });
            } else if (event.detail.value === "CorporateUser") {
                self.loadCorporateComponent();
            }
        };

        self.loadCorporateComponent = function() {
            self.approvalUser("CorporateUser");
            self.keepCheck(false);

            rootParams.dashboard.loadComponent("rules", {
                approvalUser: ko.toJS(self.approvalUser),
                partyDetailsFromApprovalNavBar: ko.toJS(self.partyDetailsFromApprovalNavBar)
            });
        };
    };
});
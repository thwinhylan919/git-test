define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/approvals",
    "./model",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist"
], function (ko, $, resourceBundle, ApprovalNavBarModel) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("user-group", "approvals");
        rootParams.baseModel.registerComponent("rules", "approvals");
        rootParams.baseModel.registerComponent("workflow", "approvals");
        rootParams.baseModel.registerComponent("workflow-admin", "admin-approvals");
        rootParams.baseModel.registerComponent("admin-user-group", "admin-approvals");
        rootParams.baseModel.registerComponent("rules-admin", "admin-approvals");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.pageTitle.approvals);
        self.partyDetailsFromApprovalNavBar = {};
        self.showChoicePopup = ko.observable(true);
        self.approvalUser = ko.observable();
        self.party = ko.observable();
        self.mode = ko.observable("APPROVALREVIEW");
        self.menuSelection = ko.observable("navLabels.userGroup");

        self.menuOptions = [
            "navLabels.userGroup",
            "navLabels.workflow",
            "navLabels.rule"
        ];

        self.uiOptions = {
            menuFloat: "right",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        ApprovalNavBarModel.fetchMe().then(function (partyId) {
            if (partyId.userProfile.partyId.displayValue) {
                self.partyDetailsFromApprovalNavBar.value = partyId.userProfile.partyId.value;
                self.partyDetailsFromApprovalNavBar.displayValue = partyId.userProfile.partyId.displayValue;
                self.loadCorporateComponent();
                self.isAdmin(false);
            } else {
                self.isAdmin(true);
            }
        });

        self.menuSelection.subscribe(function (newValue) {
            if (newValue === "navLabels.workflow") {
                rootParams.dashboard.loadComponent("workflow", {});
            } else if (newValue === "navLabels.rule") {
                rootParams.dashboard.loadComponent("rules", {});
            } else if (newValue === "navLabels.userGroup") {
                rootParams.dashboard.loadComponent("user-group", {});
            }
        });

        self.keepCheck = ko.observable(false);

        self.showModal = function () {
            $("#choicePopup").trigger("openModal");
            self.keepCheck(true);
        };

        const targetComponent = rootParams.rootModel.params.type;

        if (!targetComponent) {
            rootParams.dashboard.switchModule();
        }

        self.closeHandler = function () {
            rootParams.dashboard.switchModule();
        };

        self.loadAdminComponent = function () {
            self.approvalUser("AdminUser");
            self.keepCheck(false);

            if (targetComponent === "UserGroup") {
                rootParams.dashboard.loadComponent("admin-user-group", {});
            } else if (targetComponent === "Workflow") {
                rootParams.dashboard.loadComponent("workflow-admin", {});
            } else if (targetComponent === "Rules") {
                rootParams.dashboard.loadComponent("rules-admin", {});
            }
        };

        self.loadCorporateComponent = function () {
            self.approvalUser("CorporateUser");
            self.keepCheck(false);

            if (targetComponent === "UserGroup") {
                rootParams.dashboard.loadComponent("user-group", {});
            } else if (targetComponent === "Workflow") {
                rootParams.dashboard.loadComponent("workflow", {});
            } else if (targetComponent === "Rules") {
                rootParams.dashboard.loadComponent("rules", {});
            }
        };
    };
});
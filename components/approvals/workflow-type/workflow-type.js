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
        rootParams.baseModel.registerComponent("workflow", "approvals");
        rootParams.baseModel.registerComponent("workflow-admin", "admin-approvals");
        rootParams.baseModel.registerElement("modal-window");
        self.isAdmin = ko.observable();
        rootParams.dashboard.headerName(self.nls.pageTitle.approvals);

        self.partyDetailsFromApprovalNavBar = {
            value: null,
            displayValue: null
        };

        self.showChoicePopup = ko.observable(true);
        self.approvalUser = ko.observable();
        self.workflowType = ko.observable();
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

        self.workflowTypeSelected = function() {
            if (self.workflowType() === "AdminUser") {
                self.approvalUser("AdminUser");
                self.keepCheck(false);

                rootParams.dashboard.loadComponent("workflow-admin", {
                    approvalUser: ko.toJS(self.approvalUser)
                });
            } else if (self.workflowType() === "CorporateUser") {
                self.loadCorporateComponent();
            }
        };

        self.loadCorporateComponent = function() {
            self.approvalUser("CorporateUser");
            self.keepCheck(false);

            rootParams.dashboard.loadComponent("workflow", {
                approvalUser: ko.toJS(self.approvalUser),
                partyDetailsFromApprovalNavBar: ko.toJS(self.partyDetailsFromApprovalNavBar)
            });
        };
    };
});
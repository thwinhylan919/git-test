define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/user-profile-maintenance",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojcheckboxset"
], function(ko, UserProfileMaintenanceModel, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.selectedUserType = ko.observable();
        self.userType = ko.observable();

        self.userTypeSelectionIdle = ko.observable(true);

        self.validationTracker = ko.observable();
        self.reviewVisited = ko.observable(false);
        self.userTypeEnums = ko.observableArray();
        self.userTypeEnumsLoaded = ko.observable(false);
        self.selectedUserType = ko.observable("retailuser");
        self.diableUserType = ko.observable(true);
        self.entityList = ko.observableArray();
        self.currentEntity = ko.observable();
        self.entityListLoaded = ko.observable(false);
        self.showCreateScreen = ko.observable(false);
        self.showMaintenanceData = ko.observable(false);
        self.contactDetails = ko.observableArray();
        self.personalDetails = ko.observableArray();
        params.baseModel.registerComponent("profile-maintenance", "user-profile-maintenance");
        params.dashboard.headerName(self.nls.pageTitle.userProfileMaintenance);

        UserProfileMaintenanceModel.fetchUserGroupOptions().done(function(data) {
            ko.utils.arrayForEach(data.enterpriseRoleDTOs, function(data) {
                if (data.enterpriseRoleId !== null) {
                    self.userTypeEnums.push(data);
                }
            });

            self.userTypeEnumsLoaded(true);
        });

        UserProfileMaintenanceModel.fetchUserProfileMaintenance().done(function(data) {
            if (data !== null && data.userProfileConfigDTO !== null && (data.userProfileConfigDTO.contactDetails.length !== 0 || data.userProfileConfigDTO.personalDetails.length !== 0)) {
                self.contactDetails(data.userProfileConfigDTO.contactDetails);
                self.personalDetails(data.userProfileConfigDTO.personalDetails);
                self.showMaintenanceData(true);
                self.showCreateScreen(false);

                const context = {};

                context.reviewVisited = self.reviewVisited;
                context.contactDetails = self.contactDetails;
                context.personalDetails = self.personalDetails;
                context.showMaintenanceData = self.showMaintenanceData;
                context.showCreateScreen = self.showCreateScreen;
                params.dashboard.loadComponent("profile-maintenance", context);
            } else {
                self.showCreateScreen(true);
                self.showMaintenanceData(true);

            }
        });

        const context = {};

        context.reviewVisited = self.reviewVisited;
        context.contactDetails = self.contactDetails;
        context.personalDetails = self.personalDetails;
        context.showMaintenanceData = self.showMaintenanceData;
        context.showCreateScreen = self.showCreateScreen;

        self.openCreateMode = function() {
            params.dashboard.loadComponent("profile-maintenance", context);
        };
    };
});
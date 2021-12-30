define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/admin-user-group",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, $, UserGroupListModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.userGroupList = ko.observableArray();
        self.datasource = {};
        self.mode = "";
        rootParams.dashboard.headerName(self.nls.userGroup.adminUserGroupDetails);
        self.validationTracker = ko.observable();
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("admin-user-group-view", "admin-approvals");
        rootParams.baseModel.registerComponent("admin-user-group", "admin-approvals");
        self.groupDetails = rootParams.rootModel.params.data;

        const getNewKoModel = function() {
            const KoModel = UserGroupListModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());

        self.createNew = function() {
            self.mode = "CREATE";

            rootParams.dashboard.loadComponent("admin-user-group-view", {
                mode: self.mode
            });
        };

        if (self.groupDetails.groupDetailsFetched) {
            if (self.groupDetails.userGroupDTOs.length > 0) {
                const partyData = $.map(self.groupDetails.userGroupDTOs, function(userData) {
                    userData.usercount = userData.users.length;
                    userData.partyDetails = self.partyDetails;
                    userData.mode = "";

                    return userData;
                });

                if (partyData.length > 0) {
                    self.datasource = new oj.ArrayTableDataSource(partyData, {
                        idAttribute: "name"
                    });

                    self.dataLoaded(true);
                }
            } else {
                rootParams.baseModel.showMessages(null, [self.nls.info.noRecordFound], "INFO");
            }
        }

        self.fetchGroupDetailsCode = function() {
            if (self.groupDetails.userGroupName === "" && self.groupDetails.description === "") {
                rootParams.baseModel.showMessages(null, [self.nls.info.noDescription], "ERROR");

                return;
            }

            self.groupDetails.groupDetailsFetched(false);

            UserGroupListModel.fetchDetails(self.groupDetails.userGroupType, self.groupDetails.partyId, self.groupDetails.userGroupName, self.groupDetails.description).then(function(data) {
                self.groupDetails.userGroupDTOs = data.userGroupDTOs;

                if (data.userGroupDTOs.length > 0) {
                    self.groupDetails.userGroupDTOs = data.userGroupDTOs;
                    self.groupDetails.groupDetailsFetched(true);

                    rootParams.dashboard.loadComponent("admin-user-group-list", {
                        data: ko.toJS(self.groupDetails)
                    });
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.info.noRecordFound], "INFO");
                }
            });
        };

        self.onUserGroupSelected = function(data) {
            data.mode = "VIEW";
            self.mode = "VIEW";

            rootParams.dashboard.loadComponent("admin-user-group-view", {
                data: ko.toJS(data),
                mode: self.mode
            });
        };

        self.goToMap = function(data) {
            rootParams.dashboard.loadComponent("admin-user-group-view", {
                data: ko.toJS(data)
            });
        };

        self.back = function() {
            history.back();
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.clear = function() {
            self.groupDetails.userGroupName = "";
            self.groupDetails.description = "";
        };
    };
});
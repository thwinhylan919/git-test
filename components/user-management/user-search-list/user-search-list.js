define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/user-search-list",
    "framework/js/configurations/config",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojswitch"
], function(oj, ko, $, UserListDetailsModel, resourceBundle, Configurations) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.searchedResultResponse = rootParams.dataSource;
        self.nls = resourceBundle;
        self.authenticator = Configurations.authentication.type;
        self.userList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.selectedUserData = ko.observable();
        self.username = ko.observable();
        self.userFullData = ko.observable();
        self.componentName = ko.observable();
        self.moduleName = ko.observable();
        self.noStatus = ko.observable(false);
        self.partyData = ko.observable(false);
        self.statusOptionValue = ko.observable();
        self.reason = ko.observable();
        self.deleteStatus = ko.observable(false);
        self.statusOptionValueNew = ko.observable();
        self.deleteStatusVal = ko.observable(self.nls.header.granted);
        self.selecteduserName = ko.observable();
        self.selectedUserDetail = ko.observable();
        self.lockType = ko.observable();
        self.isLockToggleDisabled = ko.observable(false);
        self.lockTypeOption = ko.observable();
        self.reasonArea = ko.observable(true);

        if (rootParams.noStatus) {
            self.noStatus(true);
        }

        if (rootParams.partyData) {
            self.partyData(true);
        }

        if (rootParams.componentName) {
            self.componentName(rootParams.componentName);
            self.moduleName(rootParams.moduleName);
            rootParams.baseModel.registerComponent(self.componentName(), self.moduleName());
        } else {
            rootParams.baseModel.registerComponent("user-read", "user-management");
            self.componentName("user-read");
        }

        rootParams.baseModel.registerComponent("review-user-status", "user-management");
        rootParams.baseModel.registerComponent("review-user-channel-access", "user-management");
        rootParams.baseModel.registerComponent("users-update", "user-management");
        self.dynamicCols = ko.observableArray([]);

        self.getCols = function() {
            const tempCols = [{
                    headerText: self.nls.header.fullName,
                    field: "ID"
                },
                {
                    headerText: self.nls.header.userName,
                    field: "emailId"
                },
                {
                    headerText: self.nls.header.status,
                    field: "lastName"
                }
            ];

            if (Configurations.authentication.type === "OBDXAuthenticator") {
                tempCols.push({
                    headerText: self.nls.header.channelAccess,
                    field: "channelAccess"
                });
            }

            self.dynamicCols(tempCols);
        };

        if (self.searchedResultResponse.length > 0) {
            ko.utils.arrayForEach(self.searchedResultResponse, function(item) {
                self.statusOptionValue(item.lockStatus);
                self.reason(item.lockReason);
                self.lockType(item.lockType);

                if (item.deleteStatus) {
                    self.deleteStatus(item.deleteStatus);

                    if (self.deleteStatus()) {
                        self.deleteStatusVal(self.nls.header.revoked);
                    } else {
                        self.deleteStatusVal(self.nls.header.granted);
                    }
                }

                self.userList().push(item);
                self.getCols();

                self.userListDetailsDataSource = new oj.ArrayTableDataSource(self.userList(), {
                    idAttribute: "username"
                });

                self.paginationDataSource = new oj.PagingTableDataSource(self.userListDetailsDataSource);
                self.cancelButtonFlag(false);
            });
        }

        self.statusOptionChangeHandler = function(event) {
            if (event.detail) {
                self.statusOptionValueNew(event.detail.value);

                if (self.statusOptionValueNew()) {
                    self.statusOptionValue(self.nls.header.lock);
                    self.reasonArea(false);
                } else {
                    self.statusOptionValue(self.nls.header.unlock);
                    self.reason("");
                    self.reasonArea(true);

                    if (Configurations.authentication.type === "IDCSAuthenticator") {
                        self.isLockToggleDisabled(true);
                    }
                }
            }
        };

        self.channelAccessChangeHandler = function(event) {
            if (event.detail.value) {
                self.deleteStatusVal(self.nls.header.revoked);
                self.deleteStatus(true);
            } else {
                self.deleteStatusVal(self.nls.header.granted);
                self.deleteStatus(false);
            }
        };

        self.edit = function(statusModeldata) {
            self.selectedUserData(statusModeldata);
            self.statusOptionValue(statusModeldata.lockStatus);

            if (self.statusOptionValue() === "UNLOCK") {
                self.statusOptionValueNew(false);
                self.reasonArea(false);
            } else {
                self.statusOptionValueNew(true);
                self.reason(statusModeldata.lockReason);
                self.lockTypeOption(statusModeldata.lockType);

                if (statusModeldata.lockType) {
                    if (self.lockTypeOption() === "AUTOMATIC") {
                        self.reasonArea(true);
                    } else {
                        self.reasonArea(false);
                    }
                }
            }

            if (Configurations.authentication.type === "IDCSAuthenticator") {
                self.isLockToggleDisabled(false);
            }

            $("#statusDialog").trigger("openModal");
        };

        self.editChannelAccess = function(data) {
            self.selectedUserDetail(data);
            self.selecteduserName(data.username);
            self.deleteStatus(data.deleteStatus);

            if (self.deleteStatus()) {
                self.deleteStatusVal(self.nls.header.revoked);
            } else {
                self.deleteStatusVal(self.nls.header.granted);
            }

            $("#channelAccessDialog").trigger("openModal");
        };

        self.showUserDetails = function(userdetails) {
            if (self.noStatus() && self.partyData()) {
                UserListDetailsModel.readUser(userdetails.username).done(function(data) {
                    self.userFullData(data.userDTO);
                    self.statusOptionValue(data.userDTO.lockStatus);
                    self.username(data.userDTO.username);

                    rootParams.dashboard.loadComponent(self.componentName(), {
                        usernamesearched: self.usernamesearched(),
                        firstNamesearched: self.firstNamesearched(),
                        lastNamesearched: self.lastNamesearched(),
                        emailIdsearched: self.emailIdsearched(),
                        mobileNumbersearched: self.mobileNumbersearched(),
                        searchedUserList: self.user().searchedUserList(),
                        username: self.username(),
                        countries: self.countries ? self.countries() : self.countries,
                        salutationList: self.salutationList ? self.salutationList() : self.salutationList,
                        childRoleEnumsLoaded: self.childRoleEnumsLoaded ? self.childRoleEnumsLoaded() : self.childRoleEnumsLoaded,
                        isCountryFetched: self.isCountryFetched ? self.isCountryFetched() : self.isCountryFetched,
                        childRoleEnums: self.childRoleEnums ? self.childRoleEnums() : self.childRoleEnums,
                        userFullData: self.userFullData ? self.userFullData() : self.userFullData
                    });
                });
            } else {
                self.userFullData(userdetails);
                self.statusOptionValue(userdetails.lockStatus);
                self.username(userdetails.username);

                rootParams.dashboard.loadComponent(self.componentName(), {
                    usernamesearched: self.usernamesearched(),
                    firstNamesearched: self.firstNamesearched(),
                    lastNamesearched: self.lastNamesearched(),
                    emailIdsearched: self.emailIdsearched(),
                    mobileNumbersearched: self.mobileNumbersearched(),
                    searchedUserList: self.user().searchedUserList(),
                    username: self.username(),
                    countries: self.countries ? self.countries() : self.countries,
                    salutationList: self.salutationList ? self.salutationList() : self.salutationList,
                    childRoleEnumsLoaded: self.childRoleEnumsLoaded ? self.childRoleEnumsLoaded() : self.childRoleEnumsLoaded,
                    isCountryFetched: self.isCountryFetched ? self.isCountryFetched() : self.isCountryFetched,
                    childRoleEnums: self.childRoleEnums ? self.childRoleEnums() : self.childRoleEnums,
                    userFullData: self.userFullData ? self.userFullData() : self.userFullData
                });
            }
        };

        self.cancel = function() {
            $("#statusDialog").trigger("closeModal");
            $("#channelAccessDialog").trigger("closeModal");
        };

        self.submit = function() {
            $("#statusDialog").trigger("closeModal");

            rootParams.dashboard.loadComponent("review-user-status", {
                statusOptionValueNew: self.statusOptionValueNew,
                statusOptionValue: self.statusOptionValue,
                reason: self.reason,
                selectedUserData: self.selectedUserData
            });
        };

        self.submitLockStatus = function() {
            $("#channelAccessDialog").trigger("closeModal");

            const params = ko.mapping.toJS({
                deleteStatus: self.deleteStatus,
                selectedUserDetail: self.selectedUserDetail
            });

            rootParams.dashboard.loadComponent("review-user-channel-access", params);
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule();
        };
    };
});
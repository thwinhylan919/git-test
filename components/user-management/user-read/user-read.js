define([

    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/user-read",
    "ojs/ojswitch",
    "ojs/ojcheckboxset"
], function(ko, UserReadModel, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.userFullData = ko.observable();
        self.approverReview = ko.observable(false);
        self.roleHeader = ko.observable();
        self.androidDevice = ko.observable(false);
        self.androidDisabled = ko.observable(true);
        self.iOsDevice = ko.observable(false);
        self.iOsDisabled = ko.observable(true);
        self.accessPoint = ko.observableArray([]);
        self.selectedAccessPoint = ko.observableArray();
        self.selectedAccessType = ko.observable("INT");
        self.selectedAccessPointEntity = ko.observableArray();
        self.androidDeviceForPushNotification = ko.observable(false);
        self.androidDisabledForPushNotification = ko.observable(true);
        self.iOsDeviceForPushNotification = ko.observable(false);
        self.iOsDisabledForPushNotification = ko.observable(true);
        self.deviceDataLoadedForPushNotification = ko.observable(false);
        self.selectedSegmentCode = ko.observable();
        self.selectedSegmentName = ko.observable();
        self.userSegments = ko.observableArray();
        self.entityDetails = rootParams.entityDetails;
        self.isSegmentContainsRole = ko.observable(false);

        if (rootParams.data) {
            self.username = ko.observable(rootParams.data.username());
            self.approverReview(true);
        }

        self.userTypeList = ko.observableArray([]);
        self.childRoleEnums = ko.observableArray([]);
        self.childRoleEnumsLoaded = ko.observable(false);
        self.selectedChildRole = ko.observableArray([]);
        self.showConfirmation = ko.observable(false);
        self.transactionStatus = ko.observable();
        self.transactionName = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.deviceDataLoaded = ko.observable(false);
        self.homeEntityLimitPackage = ko.observable(false);
        self.isAccessPointFetched = ko.observable(false);
        self.selectedAccessPoints = ko.observableArray();
        rootParams.baseModel.registerComponent("users-update", "user-management");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        self.usernamesearched = ko.observable(rootParams.rootModel.params.usernamesearched);
        self.firstNamesearched = ko.observable(rootParams.rootModel.params.firstNamesearched);
        self.lastNamesearched = ko.observable(rootParams.rootModel.params.lastNamesearched);
        self.emailIdsearched = ko.observable(rootParams.rootModel.params.emailIdsearched);
        self.mobileNumbersearched = ko.observable(rootParams.rootModel.params.mobileNumbersearched);
        self.userList = ko.observable(rootParams.rootModel.params.searchedUserList);
        self.username = ko.observable(rootParams.rootModel.params.username);
        self.countries = ko.observable(rootParams.rootModel.params.countries);
        rootParams.dashboard.headerName(self.nls.headers.usermanagement);
        self.entityLimitPackages = ko.observableArray();
        self.accessPointGroup = ko.observableArray();
        self.accessPointExt = ko.observableArray();
        self.selectedExtAccessPoint = ko.observableArray([]);
        self.selectedSegmentRoles = ko.observableArray();

        const retailUser = self.nls.fieldname.retailUser,
            adminUser = self.nls.fieldname.administrator;

        self.limitPackageSearch = function(data, item) {
            let temp;

            for (let h = 0; h < data.entityLimitPackageMappingDTO.length; h++) {
                if (data.entityLimitPackageMappingDTO[h].limitPackage.accessPointValue === item.value) {
                    temp = {
                        limitPackage: ko.observable(data.entityLimitPackageMappingDTO[h].limitPackage.key.id),
                        accessPointDescription: item.text
                    };

                    break;
                }
            }

            return temp;
        };

        self.setEntityLimitPackages = function() {
            for (let f = 0; f < self.userFullData().limitPackages.length; f++) {
                const tempArray = [];
                let data;

                for (let b = 0; b < self.accessPoint().length; b++) {
                    data = self.limitPackageSearch(self.userFullData().limitPackages[f], self.accessPoint()[b]);

                    if (data) { tempArray.push(data); }
                }

                for (let b = 0; b < self.accessPointGroup().length; b++) {
                    data = self.limitPackageSearch(self.userFullData().limitPackages[f], self.accessPointGroup()[b]);

                    if (data) { tempArray.push(data); }
                }

                const glob = {
                    text: "Global",
                    value: "GLOBAL"
                };

                data = self.limitPackageSearch(self.userFullData().limitPackages[f], glob);

                if (data) { tempArray.push(data); }

                self.entityLimitPackages().push({
                    targetUnit: self.userFullData().limitPackages[f].targetUnit,
                    entityLimitPackageMappingDTO: tempArray
                });
            }
        };

        self.setHomeEntityParty = function() {
            for (let f = 0; f < self.userFullData().userPartyRelationshipDTOs.length; f++) {
                if (self.userFullData().userPartyRelationshipDTOs[f].determinantValue === self.userFullData().homeEntity) {
                    self.userFullData().partyId = self.userFullData().userPartyRelationshipDTOs[f].partyId;
                }
            }

            for (let g = 0; g < self.userFullData().accessibleEntities.length; g++) {
                if (self.userFullData().accessibleEntities[g].entityId === self.userFullData().homeEntity) {
                    self.userFullData().partyName = self.userFullData().accessibleEntities[g].partyName;
                }
            }
        };

        const searchParameters = {
            accessType: "INT"
        };

        Promise.all([UserReadModel.fetchAccess(searchParameters), UserReadModel.listAccessPointGroup()])
            .then(function(response) {
                const data = response[0],
                    data1 = response[1];

                for (let i = 0; i < data1.accessPointGroupListDTO.length; i++) {
                    self.accessPointGroup.push({
                        text: data1.accessPointGroupListDTO[i].description,
                        value: data1.accessPointGroupListDTO[i].accessPointGroupId
                    });
                }

                self.accessPointGroup().sort(function(a, b) {
                    if (a.value < b.value) { return -1; }

                    if (a.value > b.value) { return 1; }

                    return 0;
                });

                for (let i = 0; i < data.accessPointListDTO.length; i++) {
                    if (data.accessPointListDTO[i].type === "INT") {
                        self.accessPoint().push({
                            text: data.accessPointListDTO[i].description,
                            value: data.accessPointListDTO[i].id
                        });

                        self.accessPoint().sort(function(a, b) {
                            if (a.value < b.value) { return -1; }

                            if (a.value > b.value) { return 1; }

                            return 0;
                        });
                    } else {
                        self.accessPointExt().push({
                            text: data.accessPointListDTO[i].description,
                            value: data.accessPointListDTO[i].id
                        });
                    }
                }

                self.isAccessPointFetched(true);
            });

        Promise.all([UserReadModel.readUser(self.username()), UserReadModel.getEnterpriseRoles()]).then(function(response) {
            const data = response[0],
                dataEntRole = response[1];

            self.userTypeList = dataEntRole.enterpriseRoleDTOs;
            self.userFullData(data.userDTO);

            for (let c = 0; c < self.countries().length; c++) {
                if (self.userFullData().address.country === self.countries()[c].value) {
                    self.countryName = self.countries()[c].text;
                }
            }

            let i;

            ko.utils.arrayForEach(self.userTypeList, function(item) {
                for (i = 0; i < self.userFullData().userGroups.length; i++) {
                    if (item.enterpriseRoleId.toLowerCase() === self.userFullData().userGroups[i].toLowerCase()) {
                        self.userFullData().userType = item;

                        const index = self.userFullData().userGroups.indexOf(self.userFullData().userGroups[i]);

                        self.userFullData().userGroups.splice(index, 1);
                    }
                }
            });

            for (i = 0; i < data.userDTO.userAccessPointRelationshipList.length; i++) {
                for (let j = 0; j < self.accessPointExt().length; j++) {
                    if (data.userDTO.userAccessPointRelationshipList[i].accessPointId === self.accessPointExt()[j].value) { self.selectedExtAccessPoint.push(data.userDTO.userAccessPointRelationshipList[i]); }
                }
            }

            for (i = 0; i < data.userDTO.userAccessPointRelationshipList.length; i++) {
                if (self.userFullData().homeEntity === data.userDTO.userAccessPointRelationshipList[i].determinantValue) {
                    if (data.userDTO.userAccessPointRelationshipList[i].status === true) {
                        self.selectedAccessPoint.push(data.userDTO.userAccessPointRelationshipList[i].accessPointId);
                    }
                }
            }

            if (data.userDTO.accessibleEntity.length > 1) {
                for (let k = 0; k < data.userDTO.accessibleEntity.length; k++) {
                    data.userDTO.accessibleEntities[k].selectedAccessPoints = [];

                    for (let m = 0; m < self.userFullData().userAccessPointRelationshipList.length; m++) {
                        if (data.userDTO.accessibleEntity[k] !== self.userFullData().homeEntity && data.userDTO.accessibleEntity[k] === self.userFullData().userAccessPointRelationshipList[m].determinantValue && data.userDTO.userAccessPointRelationshipList[m].status === true) {
                            for (let n = 0; n < self.accessPoint().length; n++) {
                                if (self.userFullData().userAccessPointRelationshipList[m].accessPointId === self.accessPoint()[n].value) {
                                    self.selectedAccessPointEntity.push(self.userFullData().userAccessPointRelationshipList[m].accessPointId);
                                    data.userDTO.accessibleEntities[k].selectedAccessPoints.push(self.userFullData().userAccessPointRelationshipList[m].accessPointId);
                                }
                            }
                        }
                    }
                }
            }

            for (i = 0; i < self.userFullData().limitPackages.length; i++) {
                if (self.userFullData().limitPackages[i].targetUnit === self.userFullData().homeEntity && self.userFullData().limitPackages[i].entityLimitPackageMappingDTO.length) {
                    self.homeEntityLimitPackage(true);
                }
            }

            UserReadModel.fetchChildRole(self.userFullData().userType.enterpriseRoleId).done(function(data) {
                self.childRoleEnums(data.applicationRoleDTOs);
                self.childRoleEnumsLoaded(true);
                self.selectedChildRole(self.userFullData().applicationRoles);
            });

            if (self.userFullData().userType.enterpriseRoleName === retailUser) {
                self.userFullData().phoneNumber = self.userFullData().homePhone;
            }

            if (self.userFullData().userType.enterpriseRoleName === adminUser) {
                self.roleHeader(self.nls.headers.role);
            } else {
                self.roleHeader(self.nls.headers.limitrole);
            }

            self.setHomeEntityParty();
            self.setEntityLimitPackages();

            if (self.userFullData().userType.enterpriseRoleName === retailUser) {
                const searchParameter = {
                    selectedUser: self.userFullData().userType.enterpriseRoleId
                };

                UserReadModel.fetchUserSegments(searchParameter).done(function(data) {
                    self.userSegments([]);

                    for (let j = 0; j < data.segmentdtos.length; j++) {
                        if (data.segmentdtos[j].code === self.userFullData().segmentCode) {
                            self.selectedSegmentName(data.segmentdtos[j].name);
                            self.selectedSegmentCode(data.segmentdtos[j].code);

                            if (data.segmentdtos[j].roles !== undefined) {
                                self.selectedSegmentRoles(data.segmentdtos[j].roles);
                                self.isSegmentContainsRole(true);
                            }
                        }

                        self.userSegments().push({
                            text: data.segmentdtos[j].name,
                            value: data.segmentdtos[j].code
                        });
                    }
                });
            }

            self.dataLoaded(true);
        });

        UserReadModel.fetchDeviceCountForPushNotification(self.username()).done(function(data) {
            ko.utils.arrayForEach(data.listDTO, function(item) {
                if (item.os === "ANDROID" && item.count > 0) {
                    self.androidDeviceForPushNotification(true);
                    self.androidDisabledForPushNotification(true);
                }

                if (item.os === "IOS" && item.count > 0) {
                    self.iOsDeviceForPushNotification(true);
                    self.iOsDisabledForPushNotification(true);
                }
            });

            self.deviceDataLoadedForPushNotification(true);
        });

        UserReadModel.fetchDeviceCount(self.username()).done(function(data) {
            ko.utils.arrayForEach(data.listDTO, function(item) {
                if (item.os === "ANDROID" && item.count > 0) {
                    self.androidDevice(true);
                    self.androidDisabled(true);
                }

                if (item.os === "IOS" && item.count > 0) {
                    self.iOsDevice(true);
                    self.iOsDisabled(true);
                }
            });

            self.deviceDataLoaded(true);
        });

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.edit = function() {
            rootParams.dashboard.loadComponent("users-update", {
                androidDevice: self.androidDevice,
                iOsDevice: self.iOsDevice,
                androidDeviceForPushNotification: self.androidDeviceForPushNotification,
                iOsDeviceForPushNotification: self.iOsDeviceForPushNotification,
                androidDisabled: self.androidDisabled,
                userFullData: self.userFullData(),
                selectedAccessPoint: self.selectedAccessPoint(),
                iOsDisabled: self.iOsDisabled(),
                androidDisabledForPushNotification: self.androidDisabledForPushNotification(),
                iOsDisabledForPushNotification: self.iOsDisabledForPushNotification(),
                username: self.username(),
                countries: self.countries(),
                salutationList: self.params.salutationList,
                childRoleEnumsLoaded: self.childRoleEnumsLoaded(),
                isCountryFetched: self.params.isCountryFetched,
                childRoleEnums: self.childRoleEnums(),
                selectedSegmentCode: self.selectedSegmentCode(),
                selectedExtAccessPoint: self.selectedExtAccessPoint(),
                userSegments: self.userSegments(),
                selectedSegmentName: self.selectedSegmentName(),
                showToolTip: self.showToolTip,
                hideToolTip: self.hideToolTip
            });
        };

        self.back = function() {
            rootParams.dashboard.loadComponent("users", {});
        };

        self.showModalWindow = function() {
            $("#resetPassword").trigger("openModal");
        };

        self.hideModalWindow = function() {
            $("#resetPassword").trigger("closeModal");
        };

        self.transactionName(self.nls.fieldname.transactionName);

        self.resetPassword = function() {
            UserReadModel.resetPassword(self.userFullData().username).done(function(data, status, jqXhr) {
                $("#resetPassword").hide();
                self.transactionStatus(data.status);
                self.showConfirmation(true);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                });
            });
        };

        self.downloadUserDetails = function() {
            UserReadModel.downloadUserDetails(self.username());
        };

        self.showToolTip = function(id, holder) {
            const p = $("#" + holder),
                position = p.position(),
                toolTipHeight = $("#" + id).outerHeight(),
                toolTipWidth = $("#" + id).outerWidth(),
                viewableOffset = $("#" + holder).offset().top - $(window).scrollTop(),
                positionTop = viewableOffset > toolTipHeight ? position.top - toolTipHeight : position.top + 50;

            if (rootParams.baseModel.large()) {
                $("#" + id).css("position", "absolute");
                $("#" + id).css("top", positionTop);
                $("#" + id).css("left", position.left - (toolTipWidth / 2));
                $("#" + id).css("display", "block");
            }
        };

        self.hideToolTip = function(id) {
            $("#" + id).css("display", "none");
        };
    };
});
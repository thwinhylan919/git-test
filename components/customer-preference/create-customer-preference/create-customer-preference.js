define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/customer-preference",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpopup",
    "ojs/ojcheckboxset",
    "ojs/ojradiocheckbox",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (ko, $, CreateCPModel, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        self.setAllowedRoles = ko.observableArray();
        self.isAccessibleRoles = ko.observable();
        self.allowedRolesList = ko.observable();
        ko.utils.extend(self, rootParams.rootModel.params);
        self.payload = ko.observable(rootParams.rootModel.params.payload || {});
        self.nls = resourceBundle;
        self.resource = resourceBundle;
        self.showConfirmationScreen = ko.observable(false);
        self.transactionStatus = ko.observable();
        self.fileEncryptionKey = self.fileEncryptionKey || ko.observable();
        self.httpStatus = ko.observable();
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        rootParams.baseModel.registerComponent("access-point-mapping", "financial-limits");
        self.entityLimitPackageMapArray = ko.observableArray();
        self.accessPointType = ko.observable("INT");
        self.triggerRoles = ko.observable(false);

        self.entityLimitPackageMapArray.push({
            entityId: "PARTY",
            selectedLimitPackages: rootParams.rootModel.params.cpData && rootParams.rootModel.params.mode === "REVIEW" ? ko.observableArray(rootParams.rootModel.params.cpData().limitPackagesUtilizedByParty) : ko.observableArray(),
            limitPackages: ko.observableArray(),
            limitPackagesLoaded: ko.observable(false),
            limitPackageDetails: ko.observableArray()
        });

        self.entityLimitPackageMapArray.push({
            entityId: "USER",
            selectedLimitPackages: rootParams.rootModel.params.cpData && rootParams.rootModel.params.mode === "REVIEW" ? ko.observableArray(rootParams.rootModel.params.cpData().limitPackagesUtilizedByUser) : ko.observableArray(),
            limitPackages: ko.observableArray(),
            limitPackagesLoaded: ko.observable(false),
            limitPackageDetails: ko.observableArray()
        });

        self.fetchBankAdminRoles = function () {
            CreateCPModel.fetchChildRole("administrator").done(function (data) {
                let allowedRolesList = data.applicationRoleDTOs;
                const temp = [];

                for (let i = 0; i < allowedRolesList.length; i++) {
                    temp[i] = allowedRolesList[i].applicationRoleName;
                }

                allowedRolesList = temp;
                self.allowedRolesList(allowedRolesList);
                self.fetchCorpAdminRoles(true);
            });
        };

        self.fetchCorpAdminRoles = function (concatBankAdmin) {
            CreateCPModel.fetchChildRole("corporateuser").done(function (data) {
                if (concatBankAdmin) {
                    let allowedRolesList = self.allowedRolesList(),
                        corpAdminRoles = data.applicationRoleDTOs;
                    const temp = [];

                    for (let i = 0; i < corpAdminRoles.length; i++) {
                        temp[i] = corpAdminRoles[i].applicationRoleName;
                    }

                    corpAdminRoles = temp;
                    allowedRolesList = allowedRolesList.concat(corpAdminRoles);
                    self.allowedRolesList(allowedRolesList);
                    self.fetchRetailRoles(true);
                }
            });
        };

        self.fetchRetailRoles = function (concatBankAdmin) {
            CreateCPModel.fetchChildRole("retailuser").done(function (data) {
                if (concatBankAdmin) {
                    let allowedRolesList = self.allowedRolesList(),
                        retailRoles = data.applicationRoleDTOs;
                    const temp = [];

                    for (let i = 0; i < retailRoles.length; i++) {
                        temp[i] = retailRoles[i].applicationRoleName;
                    }

                    retailRoles = temp;
                    allowedRolesList = allowedRolesList.concat(retailRoles);
                    self.allowedRolesList(allowedRolesList);
                    self.triggerRoles(self.isAccessibleRoles());
                }
            });
        };

        self.fetchBankAdminRoles();

        self.cumulativeLevelChangeHandler = function (event) {
            if (event.detail.value) {
                self.selectedCCL(event.detail.value);
            }
        };

        self.userLimitChangeHandler = function (event) {
            if (event.detail.value) {
                if (event.detail.value) {
                    self.selectedUserLimit(event.detail.value);
                } else if (self.selectedUserLimit() === undefined || (typeof self.selectedUserLimit() === "object" && self.selectedUserLimit()[0] === undefined)) {
                    self.selectedUserLimit("");
                    self.selectedUserLimitDescription(self.nls.headings.noLimitGroupSelected);
                }
            }
        };

        self.approvalTypeChangeHandler = function () {
            self.payload().approvalType = self.selectedApprovalType();
        };

        self.switchAction = function () {
            self.payload().enabled = self.isEnabledSelected();
            self.enabled(self.isEnabledSelected());
        };

        self.enableForexDeal = function () {
            self.payload().isDealCreationEnabledValue = self.isForexDealCreationAllowed();
            self.isForexDealCreationEnabled(self.isForexDealCreationAllowed());
        };

        self.cancelOnCreate = function () {
            rootParams.dashboard.switchModule(true);
        };

        self.goBack = function () {
            rootParams.dashboard.loadComponent("preference-base", {
                isDataReceived: self.isDataReceived(false)
            });
        };

        self.enableCorpAdmin = function () {
            if (self.corpAdminEnabled() === "ENABLED") {
                self.payload().corpAdminEnabled = true;
                self.setAllowedRoles.removeAll();
                self.isAccessibleRoles(true);
            } else if (self.corpAdminEnabled() === "DISABLED") {
                self.setAllowedRoles.removeAll();
                self.isAccessibleRoles(false);
                self.payload().corpAdminEnabled = false;
            }

            self.triggerRoles(self.isAccessibleRoles());
        };

        self.createReview = function () {
            const validationTracker = document.getElementById("validationTracker");

            if (!rootParams.baseModel.showComponentValidationErrors(validationTracker)) {
                return;
            }

            const limitPackagesUtilizedByUser = [],
                limitPackagesUtilizedByParty = [];

            for (let x1 = 0; x1 < self.entityLimitPackageMapArray().length; x1++) {
                for (let x2 = 0; x2 < self.entityLimitPackageMapArray()[x1].limitPackageDetails().length; x2++) {
                    if (self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage()) {
                        const limitPackage = {};

                        limitPackage.key = {};
                        limitPackage.key.id = self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage();
                        limitPackage.accessPointValue = self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].accessPoint;

                        if (self.entityLimitPackageMapArray()[x1].entityId === "USER") {
                            limitPackagesUtilizedByUser.push(limitPackage);
                        } else {
                            limitPackagesUtilizedByParty.push(limitPackage);
                        }
                    }
                }
            }

            self.payload().partyId = self.partyID();
            self.payload().partyName = self.partyName();
            self.payload().partyLimitDescription = self.selectedCCLDescription();
            self.payload().userLimitDescription = self.selectedUserLimitDescription();
            self.payload().limitPackagesUtilizedByUser = limitPackagesUtilizedByUser;
            self.payload().limitPackagesUtilizedByParty = limitPackagesUtilizedByParty;
            self.payload().gracePeriod = self.gracePeriod();
            self.payload().allowedRoles = self.setAllowedRoles();

            if (self.fileEncryptionKey()) {
                if (self.fileEncryptionKey().length === 0 || self.fileEncryptionKey().length === 16) {
                    self.payload().fileEncryptionKey = self.fileEncryptionKey();
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.party.validFileEncKey], "INFO");

                    return;
                }
            } else {
                self.payload().fileEncryptionKey = null;
            }

            if (typeof self.selectedApprovalType() === "object") {
                self.payload().approvalType = self.selectedApprovalType()[0];
            } else {
                self.payload().approvalType = self.selectedApprovalType();
            }

            if (typeof self.enabled() === "object") {
                self.payload().enabled = self.enabled()[0];
            } else {
                self.payload().enabled = self.enabled();
            }

            if (typeof self.isForexDealCreationEnabled() === "object") {
                self.payload().dealCreationAllowed = self.isForexDealCreationEnabled()[0];
            } else {
                self.payload().dealCreationAllowed = self.isForexDealCreationEnabled();
            }

            self.payload().isActionRequired = true;

            $.extend(self.params, {
                data: self.payload()
            });

            self.showReviewForCreate(true);

            const context = {
                payload: self.payload(),
                showReviewForCreate: self.showReviewForCreate,
                partyIDdisplayValue: self.partyIDdisplayValue,
                cummulativeDataLoaded: self.cummulativeDataLoaded,
                userLimitDataLoaded: self.userLimitDataLoaded,
                maxGracePeriod: self.maxGracePeriod,
                userLimitData: self.userLimitData,
                entityLimitPackageMapArray: self.entityLimitPackageMapArray,
                accessPointType: self.accessPointType,
                isEnabledSelected: self.isEnabledSelected,
                selectedApprovalType: self.selectedApprovalType,
                isForexDealCreationAllowed: self.isForexDealCreationAllowed,
                corpAdminEnabled: self.corpAdminEnabled,
                isDataReceived: self.isDataReceived,
                gracePeriod: self.gracePeriod,
                allowedRolesList: self.allowedRolesList,
                selectedCCLDescription: self.selectedCCLDescription,
                selectedUserLimitDescription: self.selectedUserLimitDescription,
                enabled: self.enabled,
                isForexDealCreationEnabled: self.isForexDealCreationEnabled,
                isAccessibleRoles: self.isAccessibleRoles,
                setAllowedRoles: self.setAllowedRoles,
                showCreateCustomerScreen: self.showCreateCustomerScreen,
                customerPreferenceValidated: self.customerPreferenceValidated
            };

            rootParams.dashboard.loadComponent("review-create-customer-preference", context);
        };
    };
});

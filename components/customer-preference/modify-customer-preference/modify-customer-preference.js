define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/customer-preference",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpopup",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (ko, $, UpdateCPModel, ResourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        self.setRoles = ko.observable(false);
        self.setAllowedRoles = ko.observableArray();
        self.allowedRolesList = ko.observableArray();
        ko.utils.extend(self, rootParams.rootModel.params);
        self.nls = ResourceBundle;
        self.transactionStatus = ko.observable();
        self.httpStatus = ko.observable();

        if (self.fileEncryptionKey) {
            self.fileEncryptionKey = ko.observable(self.fileEncryptionKey);
        } else {
            self.fileEncryptionKey = self.fileEncryptionKey || ko.observable();
        }

        self.partyId = rootParams.rootModel.params.PartyId;
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("action-header");
        self.showReview = ko.observable(false);
        self.showConfirmationScreen = ko.observable(false);
        self.previousSelectedPartyLimit = ko.observable(rootParams.rootModel.params.selectedCCL);
        self.previousSelectedUserLimit = ko.observable(rootParams.rootModel.params.selectedUserLimit);
        rootParams.baseModel.registerElement("confirm-screen");
        self.payload = ko.observable(ko.toJS(rootParams.rootModel.params.payload));
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);

        const partyId = {};

        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;

        if (!partyId.value && ko.utils.unwrapObservable(self.allowedRoles)) {
            self.setAllowedRoles(ko.utils.unwrapObservable(self.allowedRoles));
        }

        rootParams.baseModel.registerComponent("access-point-mapping", "financial-limits");
        self.limitPackagesForParty = rootParams.rootModel.params.payload && rootParams.rootModel.params.mode === "REVIEW" ? ko.observableArray(self.payload().limitPackagesUtilizedByParty) : ko.observable(rootParams.rootModel.params.parames.limitPackagesUtilizedByParty);
        self.limitPackagesForUser = rootParams.rootModel.params.payload && rootParams.rootModel.params.mode === "REVIEW" ? ko.observableArray(self.payload().limitPackagesUtilizedByUser) : ko.observable(rootParams.rootModel.params.parames.limitPackagesUtilizedByUser);

        self.accessPointType = ko.observable("INT");
        self.entityLimitPackageMapArray = ko.observableArray();

        self.entityLimitPackageMapArray.push({
            entityId: "PARTY",
            selectedLimitPackages: self.limitPackagesForParty,
            limitPackages: ko.observableArray(),
            limitPackagesLoaded: ko.observable(false),
            limitPackageDetails: ko.observableArray()
        });

        self.entityLimitPackageMapArray.push({
            entityId: "USER",
            selectedLimitPackages: self.limitPackagesForUser,
            limitPackages: ko.observableArray(),
            limitPackagesLoaded: ko.observable(false),
            limitPackageDetails: ko.observableArray()
        });

        self.fetchBankAdminRoles = function () {
            UpdateCPModel.fetchChildRole("administrator").done(function (data) {
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
            UpdateCPModel.fetchChildRole("corporateuser").done(function (data) {
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
                    self.setRoles(true);
                }
            });
        };

        self.fetchRetailRoles = function (concatBankAdmin) {
            UpdateCPModel.fetchChildRole("retailuser").done(function (data) {
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
                } else if (self.selectedUserLimit() === undefined || (typeof self.selectedUserLimit() === "object" && self.selectedUserLimit() === undefined)) {
                    self.selectedUserLimit("");
                    self.selectedUserLimitDescription(self.nls.headings.noLimitGroupSelected);
                }
            }
        };

        self.switchAction = function () {
            self.payload().enabled = self.isEnabledSelected();
            self.enabled(self.isEnabledSelected());
        };

        self.enableForexDeal = function () {
            self.payload().isDealCreationEnabledValue = self.isForexDealCreationAllowed();
            self.isForexDealCreationEnabled(self.isForexDealCreationAllowed());
        };

        self.enableCorpAdmin = function () {
            if (self.corpAdminEnabled() === "ENABLED") {
                self.payload().corpAdminEnabled = true;
                self.setAllowedRoles([]);
                self.isAccessibleRoles(true);
            } else if (self.corpAdminEnabled() === "DISABLED") {
                self.payload().corpAdminEnabled = false;
                self.isAccessibleRoles(false);
            }
        };

        self.approvalTypeChangeHandler = function () {
            self.payload().approvalType = self.selectedApprovalType();
            self.selectedApprovalType(self.selectedApprovalType());
        };

        self.reviewCP = function () {
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
            self.payload().partyLimitDescription = self.selectedCCLDescription;
            self.payload().userLimitDescription = self.selectedUserLimitDescription;
            self.payload().allowedRoles = self.setAllowedRoles();
            self.payload().version = self.version();
            self.payload().limitPackagesUtilizedByUser = limitPackagesUtilizedByUser;
            self.payload().limitPackagesUtilizedByParty = limitPackagesUtilizedByParty;
            self.payload().gracePeriod = self.gracePeriod();

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

            if (self.corpAdminEnabled() === "ENABLED") {
                self.payload().corpAdminEnabled = true;
            } else {
                self.payload().corpAdminEnabled = false;
            }

            self.payload().isActionRequired = true;

            $.extend(self.params, {
                data: self.payload()
            });

            self.showReview(true);

            const context = {};

            context.partyName = self.partyName;
            context.gracePeriod = self.gracePeriod;
            context.selectedApprovalType = self.selectedApprovalType;
            context.enabled = self.enabled;
            context.isEnabledSelected = self.isEnabledSelected;
            context.partyIDdisplayValue = self.partyIDdisplayValue;
            context.isForexDealCreationAllowed = self.isForexDealCreationAllowed;
            context.dealCreationAllowed = self.payload().dealCreationAllowed;
            context.corpAdminEnabled = self.corpAdminEnabled;
            context.allowedRoles = self.setAllowedRoles;
            context.limitPackagesUtilizedByParty = self.payload().limitPackagesUtilizedByParty;
            context.limitPackagesUtilizedByUser = self.payload().limitPackagesUtilizedByUser;
            context.isActionRequired = true;
            context.approvalType = self.payload().approvalType;
            context.partyId = self.partyID();
            context.partyLimitDescription = self.selectedCCLDescription;
            context.userLimitDescription = self.selectedUserLimitDescription;
            context.version = self.version;
            context.showReview = self.showReview;
            context.parames = self.parames;
            context.searchCustPreferenceForPartyID = self.searchCustPreferenceForPartyID;
            context.maxGracePeriod = self.maxGracePeriod;
            context.isCorpAdmin = self.isCorpAdmin;
            context.userLimitData = self.userLimitData;
            context.partyID = self.partyID;
            context.isUserlimitLoaded = self.isUserlimitLoaded;
            context.isForexDealCreationEnabled = self.isForexDealCreationEnabled;
            context.isDataReceived = self.isDataReceived;
            context.payload = self.payload();
            context.isAccessibleRoles = self.isAccessibleRoles;
            context.showCreateCustomerScreen = self.showCreateCustomerScreen;
            context.customerPreferenceValidated = self.customerPreferenceValidated;
            context.setRoles = self.setRoles;
            context.allowedRolesList = self.allowedRolesList;

            rootParams.dashboard.loadComponent("review-modify-customer-preference", context);

        };

        self.backOnEdit = function () {
            self.searchCustPreferenceForPartyID();

            rootParams.dashboard.loadComponent("preference-base", {
                isUserlimitLoaded: self.isUserlimitLoaded,
                isselectedCCLLoaded: self.isselectedCCLLoaded,
                isDataReceived: self.isDataReceived,
                allowedRoles: self.allowedRoles,
                selectedAllowedRoles: self.selectedAllowedRoles,
                selectedCCL: self.previousSelectedPartyLimit,
                selectedUserLimit: self.previousSelectedUserLimit,
                payload: self.payload(),
                parames: self.parames,
                partyName: self.partyName,
                partyID: self.partyID,
                partyIDdisplayValue: self.partyIDdisplayValue,
                maxGracePeriod: self.maxGracePeriod,
                gracePeriod: self.gracePeriod,
                isCorpAdmin: self.isCorpAdmin,
                selectedApprovalType: self.selectedApprovalType,
                isEnabledSelected: self.isEnabledSelected,
                isForexDealCreationAllowed: self.isForexDealCreationAllowed,
                isForexDealCreationEnabled: self.isForexDealCreationEnabled,
                corpAdminEnabled: self.corpAdminEnabled,
                userLimitData: self.userLimitData,
                enabled: self.enabled,
                selectedCCLDescription: self.selectedCCLDescription,
                selectedUserLimitDescription: self.selectedUserLimitDescription,
                version: self.version,
                searchCustPreferenceForPartyID: self.searchCustPreferenceForPartyID,
                showCreateCustomerScreen: self.showCreateCustomerScreen,
                customerPreferenceValidated: self.customerPreferenceValidated,
                partyPreferenceLoaded: self.partyPreferenceLoaded,
                isAccessibleRoles: self.isAccessibleRoles
            });
        };

        self.cancelOnEdit = function () {
            rootParams.dashboard.switchModule(true);
        };
    };
});

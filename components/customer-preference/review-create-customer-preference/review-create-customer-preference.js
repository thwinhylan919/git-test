define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/customer-preference",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojradiocheckbox"
], function (ko, CreateCPModel, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel.params);
        self.nls = resourceBundle;
        self.approvalTypeDisplayValue = ko.observable();
        self.isCorpAdminEnabledValue = ko.observable();
        self.channelAccessValue = ko.observable();
        self.transactionName = ko.observable();
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        self.isForexDealCreationAllowed = ko.observable();

        const mode = "REVIEW";

        self.cpData = ko.observable();

        if (rootParams.rootModel.params.payload !== undefined) {
            self.cpData(ko.toJS(rootParams.rootModel.params.payload));
            self.partyIDdisplayValue = rootParams.rootModel.params.partyIDdisplayValue;
        }
        else {
            self.cpData(ko.toJS(rootParams.rootModel.params.data));
            self.partyIDdisplayValue = rootParams.rootModel.params.data.party.displayValue;
        }

        self.isActionReuired = ko.observable(false);

        if (self.cpData().isActionRequired) {
            self.isActionReuired(true);
        }

        if (self.cpData().approvalType === "SE") {
            self.approvalTypeDisplayValue = "SE";
        } else if (self.cpData().approvalType === "NSE") {
            self.approvalTypeDisplayValue = "NSE";
        } else if (self.cpData().approvalType === "ZE") {
            self.approvalTypeDisplayValue = "ZE";
        }

        if (self.cpData().enabled === true || self.cpData().enabled === "true") {
            self.channelAccessValue = "true";
        } else {
            self.channelAccessValue = "false";
        }

        if (self.cpData().corpAdminEnabled === true || self.cpData().corpAdminEnabled === "true") {
            self.isCorpAdminEnabledValue = "ENABLED";
        } else {
            self.isCorpAdminEnabledValue = "DISABLED";
        }

        let dealCreation;

        if (self.cpData().dealCreationAllowed === true || self.cpData().dealCreationAllowed === false) {
            dealCreation = self.cpData().dealCreationAllowed;

            self.isForexDealCreationAllowed(dealCreation + "");
        }
        else {
            dealCreation = self.cpData().dealCreationAllowed;

            self.isForexDealCreationAllowed(dealCreation);
            self.cpData().dealCreationAllowed = self.cpData().dealCreationAllowed === "true";
        }

        self.createPayload = ko.observable({});
        self.showConfirmationScreen = ko.observable();
        self.transactionName(self.nls.headings.createtransactionName);

        self.createORupdateCP = function () {
            self.createPayload().party = self.cpData().partyId;
            self.createPayload().partyName = self.cpData().partyName;
            self.createPayload().approvalType = self.cpData().approvalType;
            self.createPayload().enabled = self.cpData().enabled;

            self.createPayload().limitPackagesUtilizedByUser = self.cpData().limitPackagesUtilizedByUser;
            self.createPayload().limitPackagesUtilizedByParty = self.cpData().limitPackagesUtilizedByParty;
            self.createPayload().partyLimitDescription = self.cpData().partyLimitDescription;
            self.createPayload().userLimitDescription = self.cpData().userLimitDescription;
            self.createPayload().corpAdminEnabled = self.cpData().corpAdminEnabled;
            self.createPayload().maxUsersAllowed = self.cpData().maxUsersAllowed;
            self.createPayload().dealCreationAllowed = self.cpData().dealCreationAllowed;
            self.createPayload().allowedRoles = self.cpData().allowedRoles;

            self.createPayload().gracePeriod = self.cpData().gracePeriod;
            self.createPayload().fileEncryptionKey = self.cpData().fileEncryptionKey;

            const payload = ko.mapping.toJSON(self.createPayload());

            CreateCPModel.createCP(self.cpData().partyId, payload).done(function (data, status, jqXhr) {
                self.showConfirmationScreen(true);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName(),
                    transactionResponse: data
                });
            });

        };

        self.cancelOnCreateReview = function () {
            rootParams.dashboard.switchModule(true);
        };

        self.backOnReview = function () {
            self.showReviewForCreate(false);

            if (self.cpData().allowedRoles.length > 0) {
                self.isAccessibleRoles(true);
                self.setAllowedRoles(self.cpData().allowedRoles);
            }

            rootParams.dashboard.loadComponent("create-customer-preference", {
                mode: mode,
                showReviewForCreate: self.showReviewForCreate,
                partyIDdisplayValue: self.partyIDdisplayValue,
                maxGracePeriod: self.maxGracePeriod,
                partyName: ko.observable(self.cpData().partyName),
                cummulativeDataLoaded: self.cummulativeDataLoaded,
                userLimitDataLoaded: self.userLimitDataLoaded,
                userLimitData: self.userLimitData,
                entityLimitPackageMapArray: self.entityLimitPackageMapArray,
                accessPointType: self.accessPointType,
                isEnabledSelected: self.isEnabledSelected,
                selectedApprovalType: self.selectedApprovalType,
                isForexDealCreationAllowed: self.isForexDealCreationAllowed,
                corpAdminEnabled: self.corpAdminEnabled,
                isDataReceived: self.isDataReceived,
                gracePeriod: self.gracePeriod,
                cpData: self.cpData,
                isAccessibleRoles: self.isAccessibleRoles,
                setAllowedRoles: self.setAllowedRoles,
                allowedRolesList: self.allowedRolesList,
                partyID: ko.observable(self.cpData().partyId),
                selectedCCLDescription: self.selectedCCLDescription,
                selectedUserLimitDescription: self.selectedUserLimitDescription,
                enabled: self.enabled,
                isForexDealCreationEnabled: self.isForexDealCreationEnabled,
                payload: self.payload,
                showCreateCustomerScreen: self.showCreateCustomerScreen,
                customerPreferenceValidated: self.customerPreferenceValidated

            });
        };
    };
});

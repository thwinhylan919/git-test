define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/customer-preference",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojcheckboxset"
], function (ko, UpdateCPModel, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel.params);
        self.nls = resourceBundle;
        self.showConfirmationScreen = ko.observable();
        self.updatePayload = ko.observable({});
        self.approvalTypeDisplayValue = ko.observable();
        self.channelAccessValue = ko.observable();
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        self.isForexDealCreationAllowed = ko.observable();
        self.cpData = ko.observable();

        if (rootParams.rootModel.params.payload !== undefined) {
            self.cpData(rootParams.rootModel.params.payload);
            self.partyIDdisplayValue = rootParams.rootModel.params.partyIDdisplayValue;
        }
        else {
            self.cpData(rootParams.rootModel.params.data);
            self.partyIDdisplayValue = ko.observable();
            self.partyIDdisplayValue(rootParams.rootModel.params.data.party.displayValue);
        }

        self.isActionReuired = ko.observable(false);
        self.transactionName = ko.observable();

        self.isForexDealCreationAllowed(self.cpData().dealCreationAllowed + "");

        const mode = "REVIEW";

        if (self.cpData().isActionRequired) {
            self.isActionReuired(true);
        }

        self.transactionName(self.nls.headings.modifytransactionName);

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

        self.updateCP = function () {
            self.updatePayload().party = self.cpData().partyId;
            self.updatePayload().partyName = self.cpData().partyName;
            self.updatePayload().approvalType = self.cpData().approvalType;
            self.updatePayload().enabled = self.cpData().enabled;

            self.updatePayload().limitPackagesUtilizedByUser = self.cpData().limitPackagesUtilizedByUser;
            self.updatePayload().limitPackagesUtilizedByParty = self.cpData().limitPackagesUtilizedByParty;
            self.updatePayload().partyLimitDescription = self.cpData().partyLimitDescription;
            self.updatePayload().userLimitDescription = self.cpData().userLimitDescription;
            self.updatePayload().corpAdminEnabled = self.cpData().corpAdminEnabled;
            self.updatePayload().maxUsersAllowed = self.cpData().maxUsersAllowed;
            self.updatePayload().allowedRoles = self.cpData().allowedRoles;
            self.updatePayload().version = self.cpData().version;
            self.updatePayload().gracePeriod = self.cpData().gracePeriod;
            self.updatePayload().dealCreationAllowed = self.cpData().dealCreationAllowed;
            self.updatePayload().fileEncryptionKey = self.cpData().fileEncryptionKey;

            const payload = ko.mapping.toJSON(self.updatePayload());

            UpdateCPModel.updateCP(self.cpData().partyId, payload).done(function (data, status, jqXhr) {
                self.showConfirmationScreen(true);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName(),
                    transactionResponse: data
                });
            });
        };

        self.cancelOnUpdateReview = function () {
            rootParams.dashboard.switchModule(true);
        };

        self.backReview = function () {
            self.showReview(false);

            rootParams.dashboard.loadComponent("modify-customer-preference", {
                mode: mode,
                showReview: self.showReview,
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
                selectedCCLDescription: self.partyLimitDescription,
                selectedUserLimitDescription: self.userLimitDescription,
                searchCustPreferenceForPartyID: self.searchCustPreferenceForPartyID,
                parames: self.parames,
                isUserlimitLoaded: self.isUserlimitLoaded,
                payload: self.payload,
                version: self.version,
                isDataReceived: self.isDataReceived,
                isAccessibleRoles: self.isAccessibleRoles,
                showCreateCustomerScreen: self.showCreateCustomerScreen,
                customerPreferenceValidated: self.customerPreferenceValidated,
                partyPreferenceLoaded: self.partyPreferenceLoaded,
                setRoles: self.setRoles,
                setAllowedRoles: self.allowedRoles,
                allowedRolesList: self.allowedRolesList

            });
        };
    };
});

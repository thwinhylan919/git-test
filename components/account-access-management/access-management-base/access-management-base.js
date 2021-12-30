define([
    "knockout",
    "ojL10n!resources/nls/access-management",
    "ojs/ojinputtext",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation"
], function(ko, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showPartyValidateComponent = ko.observable(false);
        self.componentDispName = ko.observable();
        self.validationTracker = ko.observable();
        self.partyID = ko.observable();
        self.partyName = ko.observable();
        self.userID = ko.observable();
        self.userName = ko.observable();
        self.highlightedTab = ko.observable();
        self.selectedAccountsResources = ko.observableArray();
        self.casaFullResourceTaskList = ko.observable([]);
        self.tdFullResourceTaskList = ko.observable([]);
        self.loanFullResourceTaskList = ko.observable([]);
        self.lmFullResourceTaskList = ko.observable([]);
        self.vamEnabledRealFullResourceTaskList = ko.observable([]);
        self.virtualFullResourceTaskList = ko.observable([]);
        self.selectedCasaPolicyChecked = ko.observable([]);
        self.selectedTdPolicyChecked = ko.observable([]);
        self.selectedLoanPolicyChecked = ko.observable([]);
        self.selectedLMPolicyChecked = ko.observable([]);
        self.selectedVERPolicyChecked = ko.observable([]);
        self.selectedVirtualPolicyChecked = ko.observable([]);
        self.casaAccountTabVisited = ko.observable(false);
        self.tdAccountTabVisited = ko.observable(false);
        self.loanAccountTabVisited = ko.observable(false);
        self.lmAccountTabVisited = ko.observable(false);
        self.virtualAccountTabVisited = ko.observable(false);
        self.vamEnabledRealAccountTabVisited = ko.observable(false);
        self.casaTransactionTabVisited = ko.observable(false);
        self.tdTransactionTabVisited = ko.observable(false);
        self.loanTransactionTabVisited = ko.observable(false);
        self.virtualTransactionTabVisited = ko.observable(false);
        self.vamEnabledRealAccTransactionTabVisited = ko.observable(false);
        self.lmTransactionTabVisited = ko.observable(false);
        self.casaAllowedButtonsPressed = ko.observable();
        self.tdAllowedButtonsPressed = ko.observable();
        self.loanAllowedButtonsPressed = ko.observable();
        self.virtualAllowedButtonsPressed = ko.observable();
        self.vamEnabledRealAllowedButtonsPressed = ko.observable();
        self.lmAllowedButtonsPressed = ko.observable();
        self.casaAccountNumbersArray = ko.observable([]);
        self.tdAccountNumbersArray = ko.observable([]);
        self.loanAccountNumbersArray = ko.observable([]);
        self.lmAccountNumbersArray = ko.observable([]);
        self.virtualAccountNumbersArray = ko.observable([]);
        self.vamEnabledRealAccountNumbersArray = ko.observable([]);
        self.reviewScreen = ko.observable(false);
        self.showSummary = ko.observable(false);
        self.backForPartyAccess = ko.observable(false);
        self.loadUserListComponent = ko.observable(false);

        self.newExclusionArray = {
            accountNumber: {
                displayValue: "",
                value: ""
            },
            taskIds: []
        };

        self.highlightedTab = ko.observable("CASA");
        self.highlightedTabTrans = ko.observable("CASA");
        self.editButtonPressed = ko.observable(false);
        self.showModuleToMap = ko.observable(false);
        self.showDeleteButton = ko.observable(false);
        self.showReadButton = ko.observable(false);
        self.userListLoaded = ko.observable(false);
        self.isCasaAllowed = ko.observable();
        self.isTDAllowed = ko.observable();
        self.isLoanAllowed = ko.observable();
        self.isLMAllowed = ko.observable();
        self.isVirtualAllowed = ko.observable();
        self.isVAMEnabledRealAllowed = ko.observable();
        self.casaExclusionAccountNumberListUpdated = ko.observable(false);
        self.tdExclusionAccountNumberListUpdated = ko.observable(false);
        self.loanExclusionAccountNumberListUpdated = ko.observable(false);
        self.lmExclusionAccountNumberListUpdated = ko.observable(false);
        self.virtualExclusionAccountNumberListUpdated = ko.observable(false);
        self.vamEnabledRealExclusionAccountNumberListUpdated = ko.observable(false);
        self.selectedCasaPolicy = ko.observable("casaManual");
        self.selectedTdPolicy = ko.observable("tdManual");
        self.selectedLoanPolicy = ko.observable("loanManual");
        self.selectedLMPolicy = ko.observable("lmManual");
        self.selectedVirtualPolicy = ko.observable("vraManual");
        self.selectedVamEnabledRealAccPolicy = ko.observable("verManual");
        self.fullCasaAccountList = ko.observable([]);
        self.fulltdAccountList = ko.observable([]);
        self.fullloanAccountList = ko.observable([]);
        self.fullLMAccountList = ko.observable([]);
        self.fullVirtualAccountList = ko.observable([]);
        self.fullVAMEnabledRealAccountList = ko.observable([]);
        self.fullCasaAccountListCopy = ko.observable([]);
        self.fulltdAccountListCopy = ko.observable([]);
        self.fulltdAccountListNonSelectedCopy = ko.observable([]);
        self.fullloanAccountListCopy = ko.observable([]);
        self.fullLMAccountListCopy = ko.observable([]);
        self.fullVAMEnabledRealAccountListCopy = ko.observable([]);
        self.fullVirtualAccountListCopy = ko.observable([]);
        self.fullloanAccountListNonSelectedCopy = ko.observable([]);
        self.fulllmAccountListNonSelectedCopy = ko.observable([]);
        self.casaExclusionAccountNumberList = ko.observable([]);
        self.tdExclusionAccountNumberList = ko.observable([]);
        self.loanExclusionAccountNumberList = ko.observable([]);
        self.lmExclusionAccountNumberList = ko.observable([]);
        self.virtualExclusionAccountNumberList = ko.observable([]);
        self.vamEnabledRealExclusionAccountNumberList = ko.observable([]);
        self.updatedCASAExclusionNumberList = ko.observable([]);
        self.updatedTDExclusionNumberList = ko.observable([]);
        self.updatedLOANExclusionNumberList = ko.observable([]);
        self.updatedLMExclusionNumberList = ko.observable([]);
        self.updatedVirtualExclusionNumberList = ko.observable([]);
        self.updatedVAMEnabledRealExclusionNumberList = ko.observable([]);
        self.casaMappedAccounts = ko.observable([]);
        self.tdMappedAccounts = ko.observable([]);
        self.loanMappedAccounts = ko.observable([]);
        self.lmMappedAccounts = ko.observable([]);
        self.virtualMappedAccounts = ko.observable([]);
        self.vamEnabledRealMappedAccounts = ko.observable([]);
        self.casaUnMappedAccounts = ko.observable([]);
        self.tdUnMappedAccounts = ko.observable([]);
        self.loanUnMappedAccounts = ko.observable([]);
        self.lmUnMappedAccounts = ko.observable([]);
        self.virtualUnMappedAccounts = ko.observable([]);
        self.vamEnabledRealUnMappedAccounts = ko.observable([]);
        self.selectedUserId = ko.observable();
        self.selectedUserName = ko.observable();
        self.isBatchEnable = ko.observable(false);

        self.accountAccessSummaryObject = {
            totalCasaAccts: "",
            totalTrdAccts: "",
            totalLonAccts: "",
            totalLMAccts: "",
            totalVirtualAccts: "",
            totalVAMEnabledRealAccts: "",
            mappedCasaAccts: "",
            mappedTrdAccts: "",
            mappedLonAccts: "",
            mappedLMAccts: "",
            mappedVirtualAccts: "",
            mappedVAMEnabledRealAccts: ""
        };

        self.disableAccountSelection = ko.observable(false);
        self.resourceListCasa = ko.observable([]);
        self.resourceListTD = ko.observable([]);
        self.resourceListLON = ko.observable([]);
        self.resourceListLM = ko.observable([]);
        self.resourceListVRA = ko.observable([]);
        self.resourceListVER = ko.observable([]);

        self.selectedCasaAccounts = ko.observableArray();
        self.selectedTdAccounts = ko.observableArray();
        self.selectedLoanAccounts = ko.observableArray();
        self.selectedLMAccounts = ko.observableArray();
        self.selectedVirtualAccounts = ko.observableArray();
        self.selectedVAMEnabledRealAccounts = ko.observableArray();
        self.casaAccountAccessId = ko.observable();
        self.tdAccountAccessId = ko.observable();
        self.loanAccountAccessId = ko.observable();
        self.lmAccountAccessId = ko.observable();
        self.virtualAccountAccessId = ko.observable();
        self.vamEnabledRealAccountAccessId = ko.observable();
        self.transactionName = ko.observable();

        self.cameBack = ko.observable(false);

        self.transactionNames = {
            casa: "CASA",
            loan: self.nls.navLabels.Loan,
            td: self.nls.navLabels.TD,
            lm: self.nls.navLabels.LER,
            ver: self.nls.navLabels.VER,
            vra: self.nls.navLabels.VRA
        };

        self.componentId = ko.observable();
        self.accessLevel = ko.observable();
        self.accessLevel("PARTY");
        self.landingComponent = "access-management-base";

        self.setComponentId = function(id) {
            self.componentId(id);
        };

        self.casaRequestPayload = {
            accountAccessId: self.casaAccountAccessId(),
            accountType: "CSA",
            accessLevel: self.accessLevel(),
            accessStatus: self.isCasaAllowed(),
            accountExclusionDTOs: []
        };

        self.tdRequestPayload = {
            accountAccessId: self.tdAccountAccessId(),
            accountType: "CSA",
            accessLevel: self.accessLevel(),
            accessStatus: self.isTDAllowed(),
            accountExclusionDTOs: []
        };

        self.loanRequestPayload = {
            accountAccessId: self.loanAccountAccessId(),
            accountType: "CSA",
            accessLevel: self.accessLevel(),
            accessStatus: self.isLoanAllowed(),
            accountExclusionDTOs: []
        };

        self.lmRequestPayload = {
            accountAccessId: self.lmAccountAccessId(),
            accountType: "LER",
            accessLevel: self.accessLevel(),
            accessStatus: self.isLoanAllowed(),
            accountExclusionDTOs: []
        };

        self.virtualRequestPayload = {
            accountAccessId: self.virtualAccountAccessId(),
            accountType: "VRA",
            accessLevel: self.accessLevel(),
            accessStatus: self.isVirtualAllowed(),
            accountExclusionDTOs: []
        };

        self.vamEnabledRealAccRequestPayload = {
            accountAccessId: self.vamEnabledRealAccountAccessId(),
            accountType: "VER",
            accessLevel: self.accessLevel(),
            accessStatus: self.isVAMEnabledRealAllowed(),
            accountExclusionDTOs: []
        };

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
                user: self.nls.navLabels.PartyLevel_title
            }));
        } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
                user: self.nls.navLabels.UserLevel_title
            }));
        }

        self.showEditableForm = ko.observable(false);
        self.maskedPartyId = ko.observable();
        rootParams.baseModel.registerComponent("confirmation", "account-access-management");
        rootParams.baseModel.registerComponent("party-access-exclusion", "account-access-management");
        rootParams.baseModel.registerComponent("user-access-exclusion", "account-access-management");
        rootParams.baseModel.registerComponent("linked-party-access-exclusion", "account-access-management");
        rootParams.baseModel.registerComponent("mapping-modules", "account-access-management");
        rootParams.baseModel.registerComponent("create-linkage", "account-access-management");
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("account-access-nav-bar", "account-access-management");
        rootParams.baseModel.registerComponent("create-update-party-account-access", "account-access-management");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("validation", "account-access-management");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerComponent("resource-task", "account-access-management");
        rootParams.baseModel.registerComponent("transaction-selection", "account-access-management");
        rootParams.baseModel.registerComponent("account-transactions-mapping", "account-access-management");
        rootParams.baseModel.registerComponent("linked-user-access-exclusion", "account-access-management");
        rootParams.baseModel.registerComponent("review-linked-user-access-management", "account-access-management");
        rootParams.baseModel.registerComponent("review-linked-party-access-management", "account-access-management");
        rootParams.baseModel.registerComponent("review-party-access-management", "account-access-management");
        rootParams.baseModel.registerComponent("review-user-access-management", "account-access-management");

        self.createObservables = function(params, exclusionList) {
            let property;

            exclusionList = !Array.isArray(exclusionList) ? [exclusionList] : exclusionList;

            for (property in params) {
                if (exclusionList.indexOf(property) === -1 && !ko.isObservable(params[property])) {
                    if (Array.isArray(params[property])) {
                        params[property] = ko.observableArray(params[property]);
                    } else if (typeof params[property] === "function") {
                        //do nothing
                    } else {
                        params[property] = ko.observable(params[property]);
                    }
                }
            }
        };

        self.accessLevel.subscribe(function() {
            if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
                self.isCasaAllowed(false);
                self.isTDAllowed(false);
                self.isLoanAllowed(false);
                self.isLMAllowed(false);
                self.isVirtualAllowed(false);
                self.isVAMEnabledRealAllowed(false);
            } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
                self.isCasaAllowed(false);
                self.isTDAllowed(false);
                self.isLoanAllowed(false);
                self.isLMAllowed(false);
                self.isVirtualAllowed(false);
                self.isVAMEnabledRealAllowed(false);
            }
        });

    };
});
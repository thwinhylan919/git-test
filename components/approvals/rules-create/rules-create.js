define([
    "knockout",

    "./model",
    "ojL10n!resources/nls/rules",

    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojvalidationgroup"
], function(ko, ApprovalRulesModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        ko.utils.extend(self, rootParams.baseModel);
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.baseModel.registerComponent("review-rules-create", "approvals");
        rootParams.baseModel.registerComponent("rules-review", "approvals");
        rootParams.baseModel.registerComponent("user-input", "common");
        rootParams.baseModel.registerComponent("workflow-view", "approvals");
        rootParams.baseModel.registerComponent("rules-search", "approvals");
        rootParams.dashboard.headerName(self.nls.rules.ruleMaintainance);
        self.statusMessage = ko.observable();
        self.isApprovalRequired = ko.observable("NO");
        self.mode = ko.observable(self.params.mode);
        self.isCorpAdmin = ko.observable();
        self.currencyLoaded = ko.observable(false);
        self.currencyList = ko.observableArray([]);
        self.showCurrency = ko.observable(false);
        self.groupValid = ko.observable();
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.nls.common.review;
        self.reviewTransactionName.reviewHeader = self.nls.info.reviewMessage;
        self.disableUITxn = ko.observable(false);

        const partyId = {};
        let dontResetData;

        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;

        if (partyId.value) {
            self.isCorpAdmin(true);
        } else {
            self.isCorpAdmin(false);
        }

        if (self.params.partyDetails) {
            self.partyName = self.params.partyDetails.partyName;
        }

        function checkHash() {
            if (self.mode() === "EDIT") {
                rootParams.dashboard.headerName(self.nls.rules.ruleMaintainance);
                self.disableUITxn(false);
                dontResetData = false;
                self.actionHeaderheading(self.nls.headers[self.mode()]);
            } else if (self.mode() === "VIEW") {
                rootParams.dashboard.headerName(self.nls.rules.ruleMaintainance);
                self.disableUITxn(true);
                dontResetData = true;
                self.loadInitialDetails();
                self.userInputModel()[0].disableSelection(true);
                self.userInputModel()[0].disableButtonSet(true);
                self.actionHeaderheading(self.nls.headers[self.mode()]);
            } else if (self.mode() === "CREATE") {
                rootParams.dashboard.headerName(self.nls.rules.ruleMaintainance);
                self.disableUITxn(false);
                dontResetData = false;
                self.loadInitialDetails();
                self.actionHeaderheading(self.nls.headers[self.mode()]);
            } else if (self.mode() === "REVIEW") {
                rootParams.dashboard.headerName(self.nls.rules.ruleMaintainance);
                self.disableUITxn(true);
                self.userInputModel()[0].disableSelection(true);
                self.userInputModel()[0].disableButtonSet(true);
                self.actionHeaderheading(self.nls.headers[self.mode()]);
            } else if (self.mode() === "search") {
                rootParams.dashboard.headerName(self.nls.rules.ruleMaintainance);
                rootParams.dashboard.loadComponent("rules-search", {});
            }
        }

        self.selectedTransaction = ko.observable();

        self.selectedAccount = ko.observable({
            displayValue: null,
            value: null
        });

        self.fromAmount = ko.observable(null);
        self.toAmount = ko.observable(null);
        self.showAmountRule = ko.observable(false);
        self.showUserAccounts = ko.observable(false);
        self.showTransactions = ko.observable(false);
        self.validationTracker = ko.observable();
        self.actionHeaderheading = ko.observable();
        self.actionHeaderheading(self.nls.headers[self.mode()]);
        self.userGroupListLoaded = ko.observable(false);
        self.userGroupList = ko.observable();
        self.workFlowLoaded = ko.observable(false);
        self.workFlowList = ko.observable();
        self.rulesCreateUserGroupId = ko.observable();
        self.rulesCreateWorkFlowId = ko.observable();
        self.selectedUserGroupName = ko.observable();
        self.selectedWorkflowName = ko.observable();
        self.transactionRulesData = ko.observable();

        let amountRule, accountRule, transactionRule, currencyRule,
            operator;

        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.showDropDownAccounts = ko.observable(false);
        self.Accounts = ko.observableArray();
        self.showDropDownTransactions = ko.observable(false);
        self.Transactions = ko.observableArray();
        self.currency = ko.observable();
        self.transactionName = ko.observable();
        self.transactionType = ko.observable();
        self.pageLoaded = ko.observable(false);
        self.prevMode = ko.observable();
        self.version = null;
        self.workflowDetails = ko.observable();
        self.workFlowDetailsLoaded = ko.observable(false);
        self.supportedAccountTypes = [];

        self.transactionConfirmationName = ko.observable();
        self.approvalUser = rootParams.rootModel.params.approvalUser;

        let transactionTypeChanged = null;
        const getNewKoModel = function() {
            const KoModel = ApprovalRulesModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rulesCreateModelInstance = ko.observable(getNewKoModel());

        self.userInputModel = ko.observableArray([{
            partyId: ko.utils.unwrapObservable(self.params.partyDetails.party.value),
            useCase: "DEFAULT",
            selectedUser: null,
            selectedUserGroup: null,
            buttonSet: "USER",
            userType: "CUSTOMER",
            customLabel: true,
            labelDisplay: self.nls.rules.selectInitiator,
            useMode: null,
            additionalDetails: null,
            editable: ko.observable(true),
            disableSelection: ko.observable(false),
            disableButtonSet: ko.observable(false)
        }]);

        self.nodeId = ko.observable("jain");
        rootParams.baseModel.registerElement("modal-window");

        const accountsMap = {},
            populateAndDisplayAccountDropdown = function() {
                const getChildArray = function(accountObjects) {
                    const objectToPopulate = [];

                    if (accountObjects) {
                        for (let accountCounter = 0; accountCounter < accountObjects.length; accountCounter++) {
                            objectToPopulate.push({
                                label: accountObjects[accountCounter].accountNumber.displayValue,
                                value: {
                                    displayValue: accountObjects[accountCounter].accountNumber.displayValue,
                                    value: accountObjects[accountCounter].accountNumber.value
                                }
                            });
                        }
                    }

                    return objectToPopulate;
                };

                self.Accounts.removeAll();

                const accountListForDisplay = {
                    label: self.nls.rules.searchAllRules,
                    value: "ALL",
                    children: []
                };

                if (self.selectedTransaction()) {
                    const transSelected = self.selectedTransaction().split("~");

                    if (transSelected.length > 2) {
                        for (let i = 2; i < transSelected.length; i++) {
                            if (transSelected[i] === "CSA" && accountsMap.CSA) {
                                accountListForDisplay.children.push({
                                    label: self.nls.accountType.CSA,
                                    children: getChildArray(accountsMap.CSA)
                                });
                            } else if (transSelected[i] === "VRA" && accountsMap.VRA) {
                                accountListForDisplay.children.push({
                                    label: self.nls.accountType.VRA,
                                    children: getChildArray(accountsMap.VRA)
                                });
                            } else if (transSelected[i] === "TRD" && accountsMap.TRD) {
                                accountListForDisplay.children.push({
                                    label: self.nls.accountType.TRD,
                                    children: getChildArray(accountsMap.TRD)
                                });
                            } else if (transSelected[i] === "LON" && accountsMap.LON) {
                                accountListForDisplay.children.push({
                                    label: self.nls.accountType.LON,
                                    children: getChildArray(accountsMap.LON)
                                });
                            }
                        }

                        if (accountListForDisplay.children.length !== 0) {
                            self.Accounts([accountListForDisplay]);
                        } else {
                            accountListForDisplay.label = self.nls.rules.searchAllRules;
                            accountListForDisplay.children = [];

                            accountListForDisplay.children.push({
                                label: self.nls.accountType.CSA,
                                children: getChildArray(accountsMap.CSA)
                            });

                            accountListForDisplay.children.push({
                                label: self.nls.accountType.TRD,
                                children: getChildArray(accountsMap.TRD)
                            });

                            accountListForDisplay.children.push({
                                label: self.nls.accountType.LON,
                                children: getChildArray(accountsMap.LON)
                            });

                            accountListForDisplay.children.push({
                                label: self.nls.accountType.VRA,
                                children: getChildArray(accountsMap.VRA)
                            });

                            self.Accounts([accountListForDisplay]);
                        }

                        self.showDropDownAccounts(true);
                    } else {
                        self.selectedAccount(undefined);

                        if (self.showUserAccounts()) {
                            rootParams.baseModel.showMessages(null, [self.nls.rules.noAccounts], "ERROR");
                        }

                        self.showDropDownAccounts(false);
                    }
                }
            };

        ApprovalRulesModel.getAccountList(self.params.partyDetails.party.value).then(function(accountListResponse) {
            for (let i = 0; i < accountListResponse.accounts.length; i++) {
                const _accountList = accountListResponse.accounts[i];

                if (_accountList.accountsList) {
                    for (let j = 0; j < _accountList.accountsList.length; j++) {
                        const _account = _accountList.accountsList[j];

                        if (_account.accountStatus && _account.accountStatus !== "CLOSED") {
                            if (!accountsMap[_account.accountType]) {
                                accountsMap[_account.accountType] = [];
                            }

                            accountsMap[_account.accountType].push(_account);
                        }
                    }
                }
            }

            populateAndDisplayAccountDropdown();
        });

        self.showWorkflowDetails = function() {
            ApprovalRulesModel.getWorkflowDetails(self.rulesCreateWorkFlowId()).then(function(workflowData) {
                self.workflowDetails(workflowData);
                self.workFlowDetailsLoaded(true);
            });
        };

        self.rulesCreateWorkFlowIdSubscriptions = function(event) {
            if (event.detail.value) {
                self.showWorkflowDetails();
            }
        };

        const partyDetailsFetchedSubscriptions = self.rulesCreateModelInstance().approvals.partyDetailsFetched.subscribe(function(newValue) {
            if (newValue) {
                self.fetchDetails();
                self.rulesCreateModelInstance().rulesCreatePayload.ruleName("");
                self.rulesCreateUserGroupId("");
                self.rulesCreateModelInstance().rulesCreatePayload.party.value(self.params.partyDetails.party.value);
                self.fetchTransactionRules();
            }
        });

        self.changeApprovalRequired = function() {
            if (self.isApprovalRequired() === "NO") {
                self.workFlowLoaded(false);

                if (!dontResetData) {
                    self.rulesCreateWorkFlowId("");
                }
            } else if (self.isApprovalRequired() === "YES") {
                self.workFlowLoaded(true);

                if (!dontResetData) {
                    self.rulesCreateWorkFlowId("");
                }
            }
        };

        self.fetchTransactionRules = function(event) {
            if (self.mode() === "VIEW") {
                if (self.params.data.associatedRuleCriterias[0]) {
                    self.transactionType(self.params.data.associatedRuleCriterias[0].ruleCriteriaDTO.taskType);
                }
            }

            ApprovalRulesModel.getTransactionRules(self.transactionType()).then(function(financialTransactionRulesData) {
                self.transactionRulesData(financialTransactionRulesData);
                self.displayRulesData(financialTransactionRulesData);
            });

            if (!dontResetData && event && (event.detail.value === "FINANCIAL_TRANSACTION" || event.detail.value === "NONFINANCIAL_TRANSACTION" || event.detail.value === "MAINTENANCE" || event.detail.value === "ADMINISTRATION" || event.detail.value === "AMOUNT_FIN_TRANSACTION")) {
                self.resetData();
            }
        };

        self.resetData = function() {
            transactionTypeChanged = true;

            if (self.mode() === "CREATE") {
                self.rulesCreateModelInstance().rulesCreatePayload.ruleName("");
            }

            self.rulesCreateModelInstance().rulesCreatePayload.description("");

            if (self.mode() === "CREATE" || self.mode() === "EDIT") {
                self.userInputModel()[0].selectedUser = null;
                self.userInputModel()[0].selectedUserGroup = null;
                self.userInputModel()[0].buttonSet = "USER";
            }

            self.fromAmount(null);
            self.toAmount(null);

            self.selectedAccount({
                displayValue: "ALL",
                value: "ALL"
            });

            self.isApprovalRequired("NO");
            self.rulesCreateWorkFlowId(null);

            const temp = ko.observableArray();

            temp(self.userInputModel.slice(0));
            self.userInputModel.removeAll();
            self.userInputModel(ko.mapping.toJS(temp));
            self.userInputModel()[0].disableButtonSet = ko.mapping.fromJS(self.userInputModel()[0].disableButtonSet);
            self.userInputModel()[0].editable = ko.mapping.fromJS(self.userInputModel()[0].editable);
            self.userInputModel()[0].disableSelection = ko.mapping.fromJS(self.userInputModel()[0].disableSelection);
            self.userInputModel()[0].useMode = "";
        };

        self.displayRulesData = function(rulesData) {
            self.showCurrency(false);
            self.showAmountRule(false);
            self.showUserAccounts(false);
            self.showTransactions(false);

            if (rulesData.ruleCriteriaDTOs) {
                for (let i = 0; i < rulesData.ruleCriteriaDTOs.length; i++) {
                    if (rulesData.ruleCriteriaDTOs[i].ruleCriteriaName === "AMOUNT") {
                        amountRule = rulesData.ruleCriteriaDTOs[i];
                        self.showAmountRule(true);
                    } else if (rulesData.ruleCriteriaDTOs[i].ruleCriteriaName === "ACCOUNT") {
                        accountRule = rulesData.ruleCriteriaDTOs[i];
                        self.showUserAccounts(true);
                    } else if (rulesData.ruleCriteriaDTOs[i].ruleCriteriaName === "TRANSACTION") {
                        transactionRule = rulesData.ruleCriteriaDTOs[i];
                        self.transactionType(transactionRule.taskType);

                        ApprovalRulesModel.getTransactions(self.transactionType()).then(function(taskData) {
                            function mapping(obj, parent) {
                                if (obj) {
                                    parent.label = obj.name;
                                    parent.value = obj.id + "~" + obj.name;

                                    let supportedAccountTypes = null;

                                    for (let j = 0; j < obj.supportedAccountTypes.length; j++) {
                                        if (supportedAccountTypes === null) {
                                            supportedAccountTypes = obj.supportedAccountTypes[0];
                                        } else {
                                            supportedAccountTypes = supportedAccountTypes + "~" + obj.supportedAccountTypes[j];
                                        }
                                    }

                                    if (supportedAccountTypes !== null) {
                                        parent.value = obj.id + "~" + obj.name + "~" + supportedAccountTypes;
                                    }

                                    if (obj.childTasks && obj.childTasks.length > 0) {
                                        parent.children = [];

                                        for (let i = 0; i < obj.childTasks.length; i++) {
                                            parent.children.push({});
                                            mapping(obj.childTasks[i], parent.children[i]);
                                        }
                                    }
                                }
                            }

                            const mapped = {};

                            mapping(taskData.taskList[0], mapped);

                            const objectMapped = [mapped];

                            self.Transactions(objectMapped);

                            if (!self.selectedTransaction() && self.showUserAccounts()) {
                                self.selectedTransaction(objectMapped[0].value);
                                self.selectedAccount("ALL");
                            } else if (!self.selectedTransaction() && !self.showUserAccounts()) {
                                self.selectedTransaction(objectMapped[0].value);
                            } else if (transactionTypeChanged) {
                                self.selectedTransaction(objectMapped[0].value);
                                self.selectedAccount("ALL");
                                transactionTypeChanged = false;
                            }

                            self.showDropDownTransactions(true);
                            self.showTransactions(false);
                            self.showTransactions(true);
                        });
                    } else if (rulesData.ruleCriteriaDTOs[i].ruleCriteriaName === "CURRENCY") {
                        currencyRule = rulesData.ruleCriteriaDTOs[i];

                        if (self.currency()) {
                            self.currency(self.currency().toString());
                        }

                        self.showCurrency(true);
                    }
                }
            }
        };

        const selectedTransactionSubscription = self.selectedTransaction.subscribe(function() {
            if (self.mode() !== "REVIEW") {
                populateAndDisplayAccountDropdown();
            }
        });

        self.dispose = function() {
            selectedTransactionSubscription.dispose();
            partyDetailsFetchedSubscriptions.dispose();
        };

        self.fetchDetails = function() {
            ApprovalRulesModel.getWorkflow(self.params.partyDetails.party.value).then(function(workflowData) {
                self.workFlowList(workflowData.workFlowDTOs);
            });
        };

        self.create = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("validTracker"))) {
                return;
            }

            self.rulesCreateModelInstance().rulesCreatePayload.associatedRuleCriterias.removeAll();

            if (self.isApprovalRequired() === "YES") {
                for (let i = 0; i < self.workFlowList().length; i++) {
                    if (self.workFlowList()[i].workFlowId === self.rulesCreateWorkFlowId()) {
                        self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(true);
                        self.selectedWorkflowName(self.workFlowList()[i].name);
                        self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.name(self.selectedWorkflowName());
                        self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.workFlowId = self.workFlowList()[i].workFlowId;
                        break;
                    }
                }
            } else {
                self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(false);
                self.selectedWorkflowName("");
            }

            self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.partyId.value = self.params.partyDetails.party.value;
            self.rulesCreateModelInstance().rulesCreatePayload.party = self.params.partyDetails.party.value;

            if (self.userInputModel()[0].buttonSet === "USER") {
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.unary(true);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.name(self.userInputModel()[0].selectedUser);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.users()[0].userId = self.userInputModel()[0].selectedUser;
            } else if (self.userInputModel()[0].buttonSet === "USERGROUP") {
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.unary(false);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.name(self.userInputModel()[0].selectedUserGroup);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.id(self.userInputModel()[0].selectedUserGroup);
            }

            if (self.showAmountRule()) {
                if (self.toAmount() !== null && self.fromAmount() !== null) {
                    operator = "BETWEEN";
                } else if (self.toAmount() === null && self.fromAmount() !== null) {
                    operator = "GREATERTHANEQUALTO";
                } else if (self.toAmount() !== null && self.fromAmount() === null) {
                    operator = "LESSTHANEQUALSTO";
                } else if (self.toAmount() === null && self.fromAmount() === null) {
                    rootParams.baseModel.showMessages(null, [self.nls.rules.bothAmountNull], "ERROR");

                    return;
                }

                const ruleCriteriasForAmount = {
                    constraintValue1: self.fromAmount(),
                    constraintValue2: self.toAmount(),
                    constraintOperator: operator,
                    ruleCriteriaDTO: {
                        dataType: amountRule.dataType,
                        ruleCriteriaId: amountRule.ruleCriteriaId,
                        ruleCriteriaName: amountRule.ruleCriteriaName,
                        taskType: amountRule.taskType,
                        userType: amountRule.userType,
                        weightage: amountRule.weightage
                    }
                };

                self.rulesCreateModelInstance().rulesCreatePayload.associatedRuleCriterias.push(ko.mapping.fromJS(ruleCriteriasForAmount));
            }

            if (self.showTransactions()) {
                self.rulesCreateModelInstance().approvals.selectedTransaction(self.selectedTransaction().split("~")[1]);
                operator = "EQUALSTO";

                const ruleCriteriasForTransaction = {
                    constraintValue1: self.selectedTransaction().split("~")[0],
                    constraintValue2: null,
                    constraintOperator: operator,
                    ruleCriteriaDTO: {
                        dataType: transactionRule.dataType,
                        ruleCriteriaId: transactionRule.ruleCriteriaId,
                        ruleCriteriaName: transactionRule.ruleCriteriaName,
                        taskType: transactionRule.taskType,
                        userType: transactionRule.userType,
                        weightage: transactionRule.weightage
                    }
                };

                self.rulesCreateModelInstance().rulesCreatePayload.associatedRuleCriterias.push(ko.mapping.fromJS(ruleCriteriasForTransaction));
            }

            if (self.showUserAccounts()) {
                operator = "EQUALSTO";

                const ruleCriteriasForAccount = {
                    constraintValue1: self.selectedAccount() === "ALL" && self.selectedAccount().displayValue !== null ? "ALL" : {
                        displayValue: self.selectedAccount().displayValue,
                        value: self.selectedAccount().value
                    },
                    constraintValue2: null,
                    constraintOperator: operator,
                    ruleCriteriaDTO: {
                        dataType: accountRule.dataType,
                        ruleCriteriaId: accountRule.ruleCriteriaId,
                        ruleCriteriaName: accountRule.ruleCriteriaName,
                        taskType: accountRule.taskType,
                        userType: accountRule.userType,
                        weightage: accountRule.weightage
                    }
                };

                self.rulesCreateModelInstance().rulesCreatePayload.associatedRuleCriterias.push(ko.mapping.fromJS(ruleCriteriasForAccount));
            }

            if (self.showCurrency()) {
                operator = "EQUALSTO";

                const ruleCriteriasForCurrency = {
                    constraintValue1: self.currency().toString(),
                    constraintValue2: null,
                    constraintOperator: operator,
                    ruleCriteriaDTO: {
                        dataType: currencyRule.dataType,
                        ruleCriteriaId: currencyRule.ruleCriteriaId,
                        ruleCriteriaName: currencyRule.ruleCriteriaName,
                        taskType: currencyRule.taskType,
                        userType: currencyRule.userType,
                        weightage: currencyRule.weightage
                    }
                };

                self.rulesCreateModelInstance().rulesCreatePayload.associatedRuleCriterias.push(ko.mapping.fromJS(ruleCriteriasForCurrency));
            }

            if (self.prevMode() === "EDIT") {
                self.rulesCreateModelInstance().rulesCreatePayload.version(self.version);
                self.rulesCreateModelInstance().rulesCreatePayload.ruleId(self.ruleId);
                self.modify();
            } else if (self.prevMode() === "CREATE") {
                self.submit();
            }
        };

        self.submit = function() {
            self.transactionConfirmationName(self.nls.rules.createRule);

            ApprovalRulesModel.createRules(ko.mapping.toJSON(self.rulesCreateModelInstance().rulesCreatePayload)).then(function(data) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.nls.rules.createRule
                }, self);

                self.actionHeaderheading(self.nls.rules.successful);
            });
        };

        self.modify = function() {
            self.transactionConfirmationName(self.nls.rules.modifyRule);

            ApprovalRulesModel.updateRules(ko.mapping.toJSON(self.rulesCreateModelInstance().rulesCreatePayload), self.ruleId).then(function(data) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.nls.rules.modifyRule
                }, self);

                self.actionHeaderheading(self.nls.rules.successful);
            });
        };

        self.editReview = function() {
            self.userInputModel()[0].disableSelection(false);
            self.userInputModel()[0].disableButtonSet(false);

            if (self.selectedAccount() && !self.selectedAccount()) {
                self.showDropDownAccounts(true);
                self.showUserAccounts(true);
            }

            const previousValue = self.prevMode();

            self.prevMode(self.mode());
            self.mode(previousValue);
            checkHash();
        };

        self.back = function() {
            history.back();
        };

        self.editRule = function() {
            ApprovalRulesModel.fetchRule(self.ruleId).then(function(data) {
                self.version = data.ruleDTO.version;
                self.userInputModel()[0].disableSelection(false);
                self.userInputModel()[0].disableButtonSet(false);
            });

            const temp = self.selectedTransaction();

            self.selectedTransaction(self.Transactions().value);
            self.selectedTransaction(temp);
            self.mode("EDIT");
            self.disableUITxn(false);
            checkHash();
            self.actionHeaderheading(self.nls.headers[self.mode()]);
        };

        self.currencyChangeHandler = function(event) {
            self.currency(event.detail.value);
        };

        self.save = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("validTracker"))) {
                return;
            }

            if (parseFloat(self.toAmount()) < parseFloat(self.fromAmount()) && self.showAmountRule()) {
                rootParams.baseModel.showMessages(null, [self.nls.rules.fromAmountGreater], "ERROR");

                return;
            }

            if (self.showUserAccounts() && !self.showDropDownAccounts()) {
                rootParams.baseModel.showMessages(null, [self.nls.rules.noAccounts], "ERROR");

                return;
            }

            self.prevMode(self.mode());
            self.userInputModel()[0].disableSelection(true);
            self.userInputModel()[0].disableButtonSet(true);

            if (self.currency()) {
                self.currency(self.currency().toString());
            }

            self.transactionName(self.selectedTransaction().split("~")[1]);

            if (self.isApprovalRequired() === "YES") {
                let i = 0;

                for (i = 0; i < self.workFlowList().length; i++) {
                    if (self.workFlowList()[i].workFlowId === self.rulesCreateWorkFlowId()) {
                        self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(true);
                        self.selectedWorkflowName(self.workFlowList()[i].name);
                        self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.name(self.selectedWorkflowName());
                        self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.workFlowId = self.workFlowList()[i].workFlowId;
                        break;
                    }
                }
            } else {
                self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(false);
                self.selectedWorkflowName("");
            }

            self.mode("REVIEW");
            self.disableUITxn(true);
            checkHash();
            self.actionHeaderheading(self.nls.headers[self.mode()]);
        };

        self.deleteRule = function() {
            ApprovalRulesModel.deleteRule(self.ruleId).then(function(data) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.nls.rules.deleteRule
                }, self);

                self.actionHeaderheading(self.nls.rules.successful);
            });
        };

        self.cancelConfirmation = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.loadInitialDetails = function() {
            if (self.mode() === "VIEW" || self.mode() === "APPROVALREVIEW") {
                if (self.params.ruleId) {
                    ApprovalRulesModel.fetchRule(self.params.ruleId).then(function(ruleResponse) {
                        ko.utils.extend(self, ruleResponse.ruleDTO);
                        self.fetchDetails();
                        self.userInputModel()[0].disableSelection(true);
                        self.userInputModel()[0].disableButtonSet(true);
                        self.fetchTransactionRules();

                        if (self.approvalRequired) {
                            self.isApprovalRequired("YES");
                            self.workFlowLoaded(true);
                            self.rulesCreateWorkFlowId(self.workflowDto.workFlowId);
                            self.showWorkflowDetails();
                            self.selectedWorkflowName(self.workflowDto.name);
                            self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(true);
                        } else {
                            self.isApprovalRequired("NO");
                            self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(false);
                        }

                        self.rulesCreateModelInstance().rulesCreatePayload.ruleName(self.ruleName);
                        self.rulesCreateModelInstance().rulesCreatePayload.description(self.description);
                        self.userInputModel()[0].useMode = "modify";
                        self.rulesCreateUserGroupId([self.initiatorUserGroup.id]);

                        if (self.initiatorUserGroup.unary) {
                            self.userInputModel()[0].buttonSet = "USER";
                            self.userInputModel()[0].selectedUser = self.initiatorUserGroup.name;
                        } else {
                            self.userInputModel()[0].buttonSet = "USERGROUP";
                            self.userInputModel()[0].selectedUserGroup = self.initiatorUserGroup.id;
                        }

                        const temp = ko.observableArray();

                        temp(self.userInputModel.slice(0));
                        self.userInputModel.removeAll();
                        self.userInputModel(ko.mapping.toJS(temp));
                        self.userInputModel()[0].disableButtonSet = ko.mapping.fromJS(self.userInputModel()[0].disableButtonSet);
                        self.userInputModel()[0].editable = ko.mapping.fromJS(self.userInputModel()[0].editable);
                        self.userInputModel()[0].disableSelection = ko.mapping.fromJS(self.userInputModel()[0].disableSelection);
                        self.userInputModel()[0].useMode = "modify";

                        let i = 0;

                        for (; i < self.associatedRuleCriterias.length; i++) {
                            if (self.associatedRuleCriterias[i].ruleCriteriaDTO.ruleCriteriaName === "AMOUNT") {
                                self.fromAmount(self.associatedRuleCriterias[i].constraintValue1);
                                self.toAmount(self.associatedRuleCriterias[i].constraintValue2);
                                amountRule = self.associatedRuleCriterias[i].ruleCriteriaDTO;
                            } else if (self.associatedRuleCriterias[i].ruleCriteriaDTO.ruleCriteriaName === "TRANSACTION") {
                                const temp1 = i;

                                ApprovalRulesModel.getTransactions(self.associatedRuleCriterias[i].ruleCriteriaDTO.taskType).then(function(data) {
                                    const taskId = self.associatedRuleCriterias[temp1].constraintValue1;
                                    let taskName,
                                        supportedAccountTypes;

                                    if (data.taskList[0].id === taskId) {
                                        taskName = data.taskList[0].name;
                                        supportedAccountTypes = data.taskList[0].supportedAccountTypes;
                                    } else if (data.taskList[0].childTasks) {
                                        const getSupportedAccountTypes = function(node) {
                                            if (node.id === taskId) {
                                                supportedAccountTypes = node.supportedAccountTypes;
                                                taskName = node.name;
                                            } else if (node.childTasks && node.childTasks.length > 0) {
                                                for (let j = 0; j < node.childTasks.length; j++) {
                                                    getSupportedAccountTypes(node.childTasks[j]);
                                                }
                                            }
                                        };

                                        getSupportedAccountTypes(data.taskList[0]);
                                    }

                                    if (taskId) {
                                        let temp = taskId + "~" + taskName;

                                        if (supportedAccountTypes) {
                                            for (let i = 0; i < supportedAccountTypes.length; i++) {
                                                temp = temp + "~" + supportedAccountTypes[i];
                                            }
                                        }

                                        self.transactionName(taskName);
                                        self.selectedTransaction(temp);
                                        transactionRule = self.associatedRuleCriterias[temp1].ruleCriteriaDTO;
                                    }
                                });
                            } else if (self.associatedRuleCriterias[i].ruleCriteriaDTO.ruleCriteriaName === "ACCOUNT") {
                                if (self.associatedRuleCriterias[i].constraintValue1 === "ALL") {
                                    self.selectedAccount(self.associatedRuleCriterias[i].constraintValue1);
                                } else {
                                    self.selectedAccount({
                                        displayValue: self.associatedRuleCriterias[i].constraintValue1.displayValue,
                                        value: self.associatedRuleCriterias[i].constraintValue1.value
                                    });
                                }

                                accountRule = self.associatedRuleCriterias[i].ruleCriteriaDTO;
                            } else if (self.associatedRuleCriterias[i].ruleCriteriaDTO.ruleCriteriaName === "CURRENCY") {
                                self.currency([self.associatedRuleCriterias[i].constraintValue1]);
                                currencyRule = self.associatedRuleCriterias[i].ruleCriteriaDTO;
                            }

                            self.pageLoaded(true);
                        }
                    });
                }
            } else if (self.mode() === "CREATE") {
                if (self.transactionType() === "MAINTENANCE") {
                    self.transactionType("MAINTENANCE");
                } else if (self.transactionType() === "NONFINANCIAL_TRANSACTION") {
                    self.transactionType("NONFINANCIAL_TRANSACTION");
                } else if (self.transactionType() === "ADMINISTRATION") {
                    self.transactionType("ADMINISTRATION");
                } else if (self.transactionType() === "AMOUNT_FIN_TRANSACTION") {
                    self.transactionType("AMOUNT_FIN_TRANSACTION");
                } else {
                    self.transactionType("FINANCIAL_TRANSACTION");
                }

                self.rulesCreateModelInstance().approvals.partyDetailsFetched(true);
                self.pageLoaded(true);
            } else {
                self.pageLoaded(true);
            }
        };

        ApprovalRulesModel.fetchCurrencies().then(function(data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.currencyList().push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].description
                });
            }

            self.currencyLoaded(true);
        });

        checkHash();
    };
});
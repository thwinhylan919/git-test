/**
 * create-structure contains all the methods to create a structure.
 *
 * @module liquidity-managemnt
 * @requires {knockout} ko
 * @requires {object} createStructureModel
 * @requires {object} ResourceBundle
 */
define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/create-structure",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojdatetimepicker"
], function(ko, createStructureModel, ResourceBundle) {
    "use strict";

    /** Create-structure.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     *
     */
    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(createStructureModel.getNewModel());

                return KoModel;
            };
        let accountlst = [];

        self.createStructureModel = getNewKoModel().createStructure;
        self.resource = ResourceBundle;

        self.componentSequenceArray = {
            "set-structure-details": {
                label: self.resource.structureDetails,
                isVisited: false,
                next: "structure-account-mapping"
            },
            "structure-account-mapping": {
                label: self.resource.chooseAccounts,
                isVisited: false,
                next: "assemble-structure",
                back: "set-structure-details"
            },
            "assemble-structure": {
                label: self.resource.linkAccounts,
                isVisited: false,
                next: "edit-structure-instructions",
                back: "structure-account-mapping"
            },
            "edit-structure-instructions": {
                label: self.resource.setInstrucions,
                isVisited: false,
                back: "assemble-structure"
            }
        };

        ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
        self.mode = (self.params && self.params.mode) || self.mode;
        self.componentToBeLoaded = ko.observable("set-structure-details");
        self.existingStructureAccountsArray = ko.observableArray();
        self.selectedAccountArray = [];
        self.refreshTrain = ko.observable(true);
        rootParams.baseModel.registerComponent("set-structure-details", "liquidity-management");
        rootParams.baseModel.registerComponent("view-structure", "liquidity-management");
        rootParams.baseModel.registerComponent("structure-account-mapping", "liquidity-management");
        rootParams.baseModel.registerComponent("assemble-structure", "liquidity-management");
        rootParams.baseModel.registerComponent("edit-structure-instructions", "liquidity-management");

        /**
         * Generates a random string using <code>Math</code>.
         *
         * @function generateRandomString
         * @inner
         * @memberof create-structure
         * @param  {number} length - The length of string desired.
         * @return {string}        Random string of desired length is returned.
         */
        function generateRandomString(length) {
            return Math.round(Math.pow(36, length + 1) - (Math.random() * Math.pow(36, length))).toString(36).slice(1);
        }

        self.createStructureModel.structureList()[0].customerId(rootParams.dashboard.userData.userProfile.partyId.value);

        /**
         * Generates payload.
         *
         * @function generateCreatePayload
         * @memberof create-structure
         * @param  {Object} accountData - Payload details.
         * @param  {boolean} pushAccount - Flaf to specify whether account is to be pushed in payload account list or not.
         * @return {Object} Accountlst account list with details in array form.
         */
        function generateCreatePayload(accountData, pushAccount) {
            if (accountData.children && accountData.children.length) {
                for (let a = 0; a < accountData.children.length; a++) {
                    generateCreatePayload(accountData.children[a], true);
                }
            }

            if (pushAccount && accountData.account) {
                accountlst.push(accountData.account);
            }

            return accountlst;
        }

        /**
         * @function resetStructureAccountList
         * @memberof create-structure
         * @param  {Array} selectedAccountsList - List of selected accounts.
         * @param  {Object} treeData - Contains tree details.
         * @param  {Object} flag - Contains boolean value.
         * @return {void}
         */
        function resetStructureAccountList(selectedAccountsList, treeData, flag) {
            if (treeData && Object.keys(treeData).length > 0) {
                if (flag && selectedAccountsList.indexOf(treeData.account.accountDetails.accountKey.accountNo.value) === -1) {
                    self.componentSequenceArray["assemble-structure"].stageDefaultData = null;
                    self.existingStructureAccountsArray.removeAll();
                } else if (treeData.children && treeData.children.length) {
                    for (let i = 0; i < treeData.children.length; i++) {
                        resetStructureAccountList(selectedAccountsList, treeData.children[i], true);
                    }
                }

            }
        }

        /**
         * Generates payload.
         *
         * @function generatePayload
         * @memberof create-structure
         * @param  {string} currentComponent - Name of curent component.
         * @param  {Object} data - Payload details.
         * @return {void}
         */
        function generatePayload(currentComponent, data) {
            let accountDetails, treeDataAccountsArray;

            switch (currentComponent) {
                case "set-structure-details":
                    self.createStructureModel.structureList()[0].desc(data.desc);
                    self.createStructureModel.structureList()[0].priority(data.priority);
                    self.createStructureModel.structureList()[0].effDate(data.effDate);
                    self.createStructureModel.structureList()[0].endDate(data.endDate);
                    self.createStructureModel.structureList()[0].structureType(data.structureType);
                    self.createStructureModel.structureList()[0].interestMethod(data.interestMethod);
                    self.createStructureModel.structureList()[0].reallocationMethod(data.reallocationMethod);

                    if (data.centralAcc) {
                        self.createStructureModel.structureList()[0].centralAcc = {
                            value: data.centralAcc,
                            displayValue: data.centralAccDisplayValue
                        };

                        self.createStructureModel.structureList()[0].centralAccBr = data.centralAccBr;
                        self.createStructureModel.structureList()[0].centralAccCcy = data.centralAccCcy;
                    } else {
                        delete self.createStructureModel.structureList()[0].centralAcc;
                        delete self.createStructureModel.structureList()[0].centralAccBr;
                        delete self.createStructureModel.structureList()[0].centralAccCcy;
                        delete self.createStructureModel.structureList()[0].centralAccDisplayValue;
                    }

                    if (data.structureTypeChanged) {
                        self.componentSequenceArray["assemble-structure"].stageDefaultData = null;
                        self.existingStructureAccountsArray.removeAll();
                        self.componentSequenceArray["edit-structure-instructions"].stageDefaultData = null;
                    }

                    self.defaultInstructionDetails = {
                        reverseFrequency: data.reverseFrequency,
                        defaultFrequency: data.defaultFrequency,
                        instructionType: data.instructionType
                    };

                    break;
                case "structure-account-mapping":
                    if (data.selectedAccountList && self.componentSequenceArray["assemble-structure"].stageDefaultData) {
                        if (self.createStructureModel.structureList()[0].structureType() === "Sweep") {
                            resetStructureAccountList(data.selectedAccountList, self.componentSequenceArray["assemble-structure"].stageDefaultData, true);
                        } else if (self.createStructureModel.structureList()[0].structureType() !== "Sweep") {
                            resetStructureAccountList(data.selectedAccountList, self.componentSequenceArray["assemble-structure"].stageDefaultData, false);
                        }
                    }

                    self.selectedAccountArray = [];

                    for (let i = 0; i < data.selectedAccountArray.length; i++) {
                        self.selectedAccountArray.push(data.selectedAccountArray[i]);
                        self.selectedAccountArray[i].selectedAccount = ko.observableArray();
                        self.selectedAccountArray[i].instructionPriority = ko.observable();
                    }

                    break;
                case "assemble-structure":
                    self.treeData = data;
                    self.existingStructureAccountsArray.removeAll();
                    treeDataAccountsArray = generateCreatePayload(data, self.createStructureModel.structureList()[0].structureType() === "Sweep" || self.createStructureModel.structureList()[0].structureKey.versionNo() > 1);

                    for (let i = 0; i < treeDataAccountsArray.length; i++) {
                        self.existingStructureAccountsArray.push(treeDataAccountsArray[i].accountDetails.accountKey.accountNo.value);
                    }

                    break;
                case "edit-structure-instructions":
                    accountlst = [];
                    accountDetails = generateCreatePayload(data, self.createStructureModel.structureList()[0].structureType() === "Sweep" || self.createStructureModel.structureList()[0].structureKey.versionNo() > 1);
                    self.createStructureModel.structureList()[0].accountlst(accountDetails);
                    break;
                default:
                    break;
            }
        }

        /**
         * @function unVisitStage
         * @memberof create-structure
         * @param  {string} component - Name of curent component.
         * @return {void}
         */
        function unVisitStage(component) {
            if (component) {
                self.componentSequenceArray[component].isVisited = false;
                unVisitStage(self.componentSequenceArray[component].next);
            }
        }

        /**
         * @function jumpToStage
         * @memberof create-structure
         * @param  {string} component - Name of current component.
         * @return {void}
         */
        self.jumpToStage = function(component) {
            if (!self.componentSequenceArray[component].isVisited) {
                return;
            }

            document.getElementById("message-box").closeAll();
            self.refreshTrain(false);
            unVisitStage(component);
            self.stageDefaultData = self.componentSequenceArray[component].stageDefaultData;
            self.componentToBeLoaded(component);
            ko.tasks.runEarly();
            self.refreshTrain(true);
        };

        self.jumpToStage("set-structure-details");

        /**
         * @function structureAccountMappingStageDefaultData
         * @memberof create-structure
         * @param  {Object} data - Contains edit structure account list.
         * @return {Array} SelectedAccountArray array of selected accounts.
         */
        function structureAccountMappingStageDefaultData(data) {
            self.existingStructureAccountsArray.removeAll();
            self.selectedAccountsList = [];
            accountlst = [];

            const structureAccountArray = generateCreatePayload(data, self.createStructureModel.structureList()[0].structureType() === "Sweep" || self.createStructureModel.structureList()[0].structureKey.versionNo() > 1);

            self.selectedAccountArray = [];

            for (let i = 0; i < structureAccountArray.length; i++) {

                const instructiondetail = [];

                structureAccountArray[i].accountNo = structureAccountArray[i].accountDetails.accountKey.accountNo.value;

                if (structureAccountArray[i].instructionList.instructiondetailList && !structureAccountArray[i].instructionList.instructiondetailList[0]) {
                    instructiondetail.push(structureAccountArray[i].instructionList.instructiondetailList);
                    structureAccountArray[i].instructionList.instructiondetailList = instructiondetail;
                }

                self.existingStructureAccountsArray.push(structureAccountArray[i].accountDetails.accountKey.accountNo.value);
                self.selectedAccountsList.push(structureAccountArray[i].accountDetails.accountKey.accountNo.value);
                self.selectedAccountArray.push(structureAccountArray[i]);
            }

            return {
                selectedAccountArray: self.selectedAccountArray,
                selectedAccountList: self.selectedAccountsList
            };
        }

        /**
         * @function editStructureHandler
         * @memberof create-structure
         * @param  {Object} editData - Contains edit structure payload.
         * @return {void}
         */
        function editStructureHandler(editData) {
            self.componentSequenceArray["set-structure-details"].stageDefaultData = editData;
            self.componentSequenceArray["structure-account-mapping"].stageDefaultData = structureAccountMappingStageDefaultData(editData.accountlst);
            self.componentSequenceArray["assemble-structure"].stageDefaultData = editData.accountlst;
            self.componentSequenceArray["edit-structure-instructions"].stageDefaultData = editData;
            self.stageDefaultData = self.componentSequenceArray[self.componentToBeLoaded()].stageDefaultData;
        }

        if (self.backFromReview) {
            if (self.mode === "edit") {
                rootParams.dashboard.headerName(self.resource.editAccountStructure);
            } else {
                rootParams.dashboard.headerName(self.resource.createAccountStructure);
            }
        }

        if (!self.backFromReview) {
            if (self.params && self.mode === "edit") {
                rootParams.dashboard.headerName(self.resource.editAccountStructure);
                self.createStructureModel.structureList()[0].structureKey.versionNo(self.params.editStructureModel.structureList.structureKey.versionNo + 1);
                self.createStructureModel.structureList()[0].structureKey.structureId(self.params.editStructureModel.structureList.structureKey.structureId);
                self.createStructureModel.structureList()[0].structureKey.structureId(self.params.editStructureModel.structureList.structureKey.structureId);
                self.createStructureModel.structureList()[0].structureStatus(self.params.editStructureModel.structureList.structureStatus);
                editStructureHandler(ko.mapping.toJS(self.params.editStructureModel.structureList));
            } else {
                rootParams.dashboard.headerName(self.resource.createAccountStructure);
                self.createStructureModel.structureList()[0].structureKey.versionNo(1);
                self.createStructureModel.structureList()[0].structureKey.structureId("ST" + generateRandomString(10).toUpperCase());
            }
        }

        /**
         * @function stageChangeHandler
         * @memberof create-structure
         * @param  {string} currentComponent - Name of curent component.
         * @param  {Object} modelData - Contains payload details.
         * @param  {string} actionTriggered - Action details triggered by user.
         * @return {void}
         */
        self.stageChangeHandler = function(currentComponent, modelData, actionTriggered) {
            self.refreshTrain(false);

            if (modelData) {
                generatePayload(currentComponent, ko.mapping.toJS(modelData));
                self.componentSequenceArray[currentComponent].stageDefaultData = modelData;
            }

            const componentToBeLoaded = self.componentSequenceArray[currentComponent][actionTriggered];

            if (componentToBeLoaded) {
                self.stageDefaultData = self.componentSequenceArray[componentToBeLoaded].stageDefaultData;
                self.componentSequenceArray[actionTriggered === "next" ? currentComponent : componentToBeLoaded].isVisited = actionTriggered === "next";
                self.componentToBeLoaded(componentToBeLoaded);
                ko.tasks.runEarly();
                self.refreshTrain(true);
            } else {
                rootParams.dashboard.loadComponent("view-structure", {
                    mode: self.mode || "review",
                    createStructureModel: self.createStructureModel,
                    backFromReview: true,
                    treeData: self.treeData,
                    componentSequenceArray: self.componentSequenceArray
                });

            }
        };
    };
});
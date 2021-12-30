/**
 * structure-account-mapping helps to add account for a particular structure for a particular id
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} structureModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/structure-account-mapping",
    "ojs/ojknockout",
    "ojs/ojoption",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function(oj, ko, $, structureAccountMappingModel, ResourceBundle) {
    "use strict";

    /** Structure Account mapping for a particular structure of the party.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.addedAccountDataSource = ko.observable();
        self.accountList = ko.observable();
        self.isAccountListLoaded = ko.observable(false);
        self.selectedAccountArray = ko.observableArray(rootParams.defaultData ? rootParams.defaultData.selectedAccountArray : null);
        rootParams.baseModel.registerComponent("select-structure-account", "liquidity-management");
        rootParams.baseModel.registerElement("action-header");
        self.addedAccountDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));

        self.selectedAccountsList = rootParams.defaultData ? rootParams.defaultData.selectedAccountList : [];

        /**
         * Populates selected account table.
         *
         * @memberOf structure-account-mapping
         * @function populateSelectedAccountTable
         * @param {Array} selectedAccounts - List of selected accounts.
         * @returns {void}
         */
        function populateSelectedAccountTable(selectedAccounts) {
            self.addedAccountDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(selectedAccounts || [], { idAttribute: ["accountNo"] })));
        }

        const taskCode = rootParams.mode === "edit" ? "LM_M_ES" : "LM_M_CNS";

        structureAccountMappingModel.fetchAccount(rootParams.structureType() !== "Pool",taskCode).then(function(accountListresponse) {
            self.accountList(accountListresponse.jsonNode.accountList);
            self.selectedAccountArray.removeAll();

            for (let j = 0; j < self.accountList().length; j++) {
                if (self.selectedAccountsList && self.selectedAccountsList.indexOf(self.accountList()[j].accountKey.accountNo.value) !== -1) {
                    self.selectedAccountArray.push(self.accountList()[j]);
                }
            }

            for (let k = 0; k < self.selectedAccountArray().length; k++) {
                self.selectedAccountArray()[k].selectedAccount = ko.observableArray();
                self.selectedAccountArray()[k].selectedAccount.push(self.selectedAccountArray()[k].accountKey.accountNo.value);
            }

            for (let i = 0; i < self.accountList().length; i++) {
                const previousSelectedAccount = ko.utils.arrayFirst(self.selectedAccountArray(), function(element) {
                    return element.accountDetails ? element.accountDetails.accountKey.accountNo.value === self.accountList()[i].accountKey.accountNo.value : element.accountKey.accountNo.value === self.accountList()[i].accountKey.accountNo.value;
                });

                self.accountList()[i].selectedAccount = ko.observableArray(previousSelectedAccount ? previousSelectedAccount.selectedAccount() : null);

                self.accountList()[i].accountDetails = {
                    accountDesc: self.accountList()[i].accountDesc,
                    accountKey: self.accountList()[i].accountKey,
                    currentBalance: self.accountList()[i].currentBalance,
                    customerDesc: self.accountList()[i].customerDesc,
                    limitCcy: self.accountList()[i].limitCcy,
                    isExtAccChk: self.accountList()[i].isExtAccChk
                };

                self.accountList()[i].accountNo = self.accountList()[i].accountKey.accountNo.value;
                delete self.accountList()[i].accountKey;
                delete self.accountList()[i].accountDesc;
                delete self.accountList()[i].currentBalance;
                delete self.accountList()[i].customerDesc;
                delete self.accountList()[i].limitCcy;
                delete self.accountList()[i].isExtAccChk;
            }

            if (self.selectedAccountArray().length) {
                populateSelectedAccountTable(self.selectedAccountArray());
            }

            self.isAccountListLoaded(true);
        });

        const selectedAccountArray = self.selectedAccountArray.subscribe(populateSelectedAccountTable);

        /**
         * This function will be used to open the overlay for addition of accounts for that party.
         *
         * @memberOf structure-account-mapping
         * @function addAccount
         * @returns {void}
         */
        self.addAccount = function() {
            rootParams.dashboard.openRightPanel("select-structure-account", {
                accountlist: self.accountList(),
                mode : "add",
                selectedAccountArray: self.selectedAccountArray
            }, self.resource.labels.addAccount);
        };

        /**
         * This function will be used to delete row from table.
         *
         * @memberOf structure-account-mapping
         * @function removeAccount
         * @param {string} accountNo - Account number of the row to be deeted.
         * @returns {void}
         */
        function removeAccount(accountNo) {
            for (let i = 0; i < self.selectedAccountArray().length; i++) {
                if (self.selectedAccountArray()[i].accountDetails.accountKey.accountNo.value === accountNo) {
                    self.selectedAccountArray.remove(self.selectedAccountArray()[i]);
                    break;
                }
            }

            for (let i = 0; i < self.accountList().length; i++) {
                if (self.accountList()[i].accountDetails.accountKey.accountNo.value === accountNo) {
                    self.accountList()[i].selectedAccount.removeAll();
                    break;
                }
            }

            self.addedAccountDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.selectedAccountArray(), { idAttribute: ["accountNo"] })));
            self.closeWarning("#existing-account");
        }

        self.accountToBeDisplayed = ko.observable();
        self.accountValueToRemove = ko.observable();

        /**
         * This function will be used to delete row from table.
         *
         * @memberOf structure-account-mapping
         * @function deleteRow
         * @param {string} accountNo - Account number of the row to be deeted.
         * @returns {void}
         */
        self.deleteRow = function(accountNo) {
            let accountmatched = false;

            self.accountToBeDisplayed(accountNo.displayValue);
            self.accountValueToRemove(accountNo.value);

            if (rootParams.existingStructureAccountsArray() && rootParams.existingStructureAccountsArray().length) {
                for (let K = 0; K < rootParams.existingStructureAccountsArray().length; K++) {
                    if (rootParams.existingStructureAccountsArray()[K] === accountNo.value) {
                        accountmatched = true;
                        break;
                    }
                }
            }

            if (accountmatched) {
                $("#existing-account").trigger("openModal");
            } else {
                removeAccount(self.accountValueToRemove());
            }
        };

        /**
         * This function will be used to delete row from table.
         *
         * @memberOf structure-account-mapping
         * @function resetStructureAccount
         * @param {string} accountNo - Account number of the row to be deeted.
         * @returns {void}
         */
        self.resetStructureAccount = function() {
            removeAccount(self.accountValueToRemove());
        };

        /**
         * This function will be used close the modal window.
         *
         * @memberOf structure-account-mapping
         * @param {string} id - Of model window to be closed.
         * @function closeWarning
         * @returns {void}
         */
        self.closeWarning = function(id) {
            $(id).trigger("closeModal");
        };

        /**
         * This function will be used close the modal window.
         *
         * @memberOf structure-account-mapping
         * @param {Array} selectedAccountArray - Details of selected accounts.
         * @function extractAccounts
         * @returns {Array} SelectedAccountArray updated array for details of selected accounts.
         */
        function extractAccounts(selectedAccountArray) {
            self.selectedAccountsList = [];

            for (let t = 0; t < selectedAccountArray.length; t++) {
                self.selectedAccountsList.push(selectedAccountArray[t].accountDetails.accountKey.accountNo.value);
            }
        }

        self.next = function() {
            if(self.createStructureModel.structureList()[0].structureType() === "Sweep"){

                if (self.selectedAccountArray().length >= 2) {
                    extractAccounts(self.selectedAccountArray());

                    rootParams.stageChangeHandler("structure-account-mapping", {
                        selectedAccountArray: self.selectedAccountArray(),
                        selectedAccountList: self.selectedAccountsList
                    }, "next");
                } else {
                    rootParams.baseModel.showMessages(null, [self.resource.labels.info], "INFO");
                }
            }
            else if(self.createStructureModel.structureList()[0].structureType() !== "Sweep"){

                if(self.selectedAccountArray().length >= 1){
                    extractAccounts(self.selectedAccountArray());

                    rootParams.stageChangeHandler("structure-account-mapping", {
                        selectedAccountArray: self.selectedAccountArray(),
                        selectedAccountList: self.selectedAccountsList
                    }, "next");
                }
                else{
                    rootParams.baseModel.showMessages(null, [self.resource.labels.infoMessage], "INFO");
                }
            }
        };

        self.back = function() {
            if (self.selectedAccountArray().length > 1) {
                extractAccounts(self.selectedAccountArray());
            }

            rootParams.stageChangeHandler("structure-account-mapping", {
                selectedAccountArray: self.selectedAccountArray(),
                selectedAccountList: self.selectedAccountsList
            }, "back");
        };

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf structure-account-mapping
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            selectedAccountArray.dispose();
        };
    };
});
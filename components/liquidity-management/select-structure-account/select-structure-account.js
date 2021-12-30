/**
 * select-structure-account helps to add accounts for a particular structure for a particular id
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/select-structure-account",
    "ojs/ojknockout",
    "ojs/ojoption",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojvalidationgroup",
    "ojs/ojradioset"
], function(oj, ko, ResourceBundle) {
    "use strict";

    /** Structure Account mapping for a particular structure of the party.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.mode = rootParams.rootModel.mode;
        self.resource = ResourceBundle;
        rootParams.baseModel.registerElement("search-box");
        self.accountListDetailsDataSource = ko.observable();
        self.headerAccount = ko.observable();
        self.priorityVisibilityMap = {};
        self.selectedAccts = ko.observableArray();
        self.cashCCMethod = ko.observable(self.structureType === "Hybrid" ? self.defaultCashCCMethod || "Pool" : self.structureType);
        self.accountListDetailsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.accountlist, { idAttribute: ["accountNo"] }) || []));

        /**
         * This function will be used to add all acounts based on select all option for for all the check boxes.
         *
         * @memberOf select-structure-account
         * @function selectAllListener
         * @param {Object} event - To be passed for handler.
         * @returns {void}
         */
        self.selectAllListener = function(event) {
            if (event.detail.value[0]) {
                for (let i = 0; i < self.accountlist.length; i++) {
                    if (self.accountlist[i].selectedAccount().indexOf(self.accountlist[i].accountDetails.accountKey.accountNo.value) === -1) {
                        self.accountlist[i].selectedAccount.push(self.accountlist[i].accountDetails.accountKey.accountNo.value);
                        self.selectedAccts.push(self.accountlist[i].accountDetails.accountKey.accountNo.value);
                    }

                    if (self.setPriority) {
                        self.priorityVisibilityMap[self.accountlist[i].accountDetails.accountKey.accountNo.value](false);
                    }
                }
            } else if (event.detail.previousValue[0]) {
                self.selectedAccts([]);

                for (let i = 0; i < self.accountlist.length; i++) {
                    self.accountlist[i].selectedAccount.removeAll();

                    if(self.setPriority){

                        self.accountlist[i].instructionPriority(null);
                        self.priorityVisibilityMap[self.accountlist[i].accountDetails.accountKey.accountNo.value](true);
                    }

                }

            }
        };

        for (let i = 0; i < self.accountlist.length; i++) {
            if (self.accountlist[i].selectedAccount().length) {
                self.selectedAccts.push(self.accountlist[i].selectedAccount()[0]);
            }

            if (self.setPriority) {
                self.priorityVisibilityMap[self.accountlist[i].accountDetails.accountKey.accountNo.value] = ko.observable(!self.accountlist[i].instructionPriority());
            }

        }

        /**
         * This function will be used to add accounts selected through checkbox one by one.
         *
         * @memberOf select-structure-account
         * @function selectedAccountListener
         * @param {Object} event - To be passed for the selected account.
         * @returns {void}
         */
        self.selectedAccountListener = function(event) {
            if (event.detail.updatedFrom === "internal") {
                if (event.detail.value[0]) {
                    self.selectedAccts.push(event.detail.value[0]);

                    if (self.setPriority) {
                        self.priorityVisibilityMap[event.detail.value[0]](false);
                    }
                } else if (event.detail.previousValue[0]) {
                    self.selectedAccts.splice(self.selectedAccts.indexOf(event.detail.previousValue[0]), 1);

                    if (self.setPriority) {
                        self.priorityVisibilityMap[event.detail.previousValue[0]](true);

                        const unselectedAccount = ko.utils.arrayFirst(self.accountlist, function(account) {
                            return account.accountDetails.accountKey.accountNo.value === event.detail.previousValue[0];
                        });

                        unselectedAccount.instructionPriority(null);
                    }
                }
            }
        };

        /**
         * This function will be used to add the selected accounts from the list of accounts from table and then close the overlay.
         *
         * @memberOf select-structure-account
         * @function addAccount
         * @returns {void}
         */
        self.addAccount = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("accountTracker"))) {
                return;
            }

            if (self.mode === "link" || self.mode === "add") {
                const selectedAccountDetailsArray = [];

                for (let i = 0; i < self.selectedAccts().length; i++) {
                    selectedAccountDetailsArray.push(ko.utils.arrayFirst(self.accountlist, function(element) {
                        return element.accountDetails.accountKey.accountNo.value === self.selectedAccts()[i];
                    }));
                }

                if (self.accountSelectionCallBack) {
                    self.accountSelectionCallBack(selectedAccountDetailsArray, self.cashCCMethod());
                } else {
                    self.selectedAccountArray(selectedAccountDetailsArray);
                }
            } else {
                self.selectedHeaderAccount(ko.mapping.toJS(self.headerAccount()));
            }

            rootParams.closeHandler();
        };
    };
});
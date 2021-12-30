/**
 * Assemble structure helps to configure structure in tree or tabular format
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} assembleStructureModel
 * @requires {object} ResourceBundle
 */
define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/assemble-structure",
    "ojs/ojknockout",
    "ojs/ojoption",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function(ko, $, assembleStructureModel, ResourceBundle) {
    "use strict";

    /**
     * Assemble Structure component is used to assemble the structure and opens overlay to add header account for structure.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     */
    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(assembleStructureModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.validateStructureModel = getNewKoModel().validateStructureModel;
        self.resources = ResourceBundle;
        self.selectedHeaderAccount = ko.observable();
        self.selectedChildAccountList = ko.observable();
        self.viewas = ko.observable(self.params && self.params.viewas ? self.params.viewas : "tree");
        self.structureType = rootParams.structureType() ? rootParams.structureType() : null;
        self.structureDetails = ko.observable(rootParams.structureDetails);
        self.selectedReplaceAccount = ko.observable();
        self.isIEBrowser = ko.observable(false);

        /* Sample function that returns boolean in case the browser is Internet Explorer*/
        function isIE() {
            const ua = navigator.userAgent,
                is_ie = ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1;

            return is_ie;
        }

        const originalSelectedAccountArray = ko.mapping.toJS(rootParams.selectedAccountArray);

        self.structureAccounts = rootParams.selectedAccountArray;
        self.mode = ko.observable("create");

        rootParams.baseModel.registerComponent("select-structure-account", "liquidity-management");
        rootParams.baseModel.registerComponent("tree-view", "liquidity-management");
        rootParams.baseModel.registerComponent("view-structure-tabular", "liquidity-management");
        rootParams.baseModel.registerComponent("notional-account-details", "liquidity-management");

        self.treeData = ko.observable(rootParams.defaultData);
        self.headerAccountDetailsLoaded = ko.observable(false);
        self.nodeAccount = ko.observable();
        self.selectedAccountArray = ko.observable();
        self.refreshTree = ko.observable(true);
        self.isValidated = ko.observable(false);
        self.finalPayload = ko.observableArray();

        let accountlst = [];

        /**
         * This function will be used to go to previous component.
         *
         * @memberOf assemble-structure
         * @function back
         * @returns {void}
         */
        self.back = function() {
            rootParams.stageChangeHandler("assemble-structure", self.treeData(), "back");
        };

        /**
         * Call back function when header selection overlay is closed. If header is not selected, it will take
         * user to previous screen.
         *
         * @memberOf assemble-structure
         * @function headerSelectionCloseHandler
         * @returns {void}
         */
        function headerOverlayCloseHandler() {
            if (!self.selectedHeaderAccount()) {
                self.back();
            }
        }

        /**
         * This function is used to refresh data based on selected icon on screen.
         *
         * @memberOf assemble-structure
         * @function reset
         * @param {Object} data - To be passed to refresh.
         * @returns {void}
         */
        self.reset = function(data) {
            self.refreshTree(false);
            self.viewas(data);
            self.refreshTree(true);
        };

        /**
         * Opens overlay to select header account for the tree.
         *
         * @memberOf assemble-structure
         * @function selectHeaderAccount
         * @returns {void}
         */
        function selectHeaderAccount() {
            if (rootParams.structureType() === "Sweep") {
                rootParams.dashboard.openRightPanel("select-structure-account", {
                    accountlist: self.structureAccounts,
                    mode: "header",
                    selectedHeaderAccount: self.selectedHeaderAccount
                }, self.resources.labels.overlayHeader, headerOverlayCloseHandler);
            } else {
                rootParams.dashboard.openRightPanel("notional-account-details", {
                    headerAccountflag: true,
                    selectedHeaderAccount: self.selectedHeaderAccount,
                    structureDetails: self.structureDetails
                }, self.resources.labels.createHeaderAccount, headerOverlayCloseHandler);
            }
        }

        if (self.treeData() && Object.keys(self.treeData()).length) {
            if (isIE()) {
                self.reset("table");
                self.isIEBrowser(true);
            } else {
                self.isIEBrowser(false);
            }

            self.headerAccountDetailsLoaded(true);
        } else {
            selectHeaderAccount();
        }

        self.structureTypeList = ko.observableArray();

        assembleStructureModel.getStructureType().then(function(structureTypeResponse) {
            if (structureTypeResponse && structureTypeResponse.enumRepresentations[0].data !== null && structureTypeResponse.enumRepresentations[0].data.length > 0) {
                for (let i = 0; i < structureTypeResponse.enumRepresentations[0].data.length; i++) {
                    self.structureTypeList.push({
                        text: structureTypeResponse.enumRepresentations[0].data[i].description,
                        value: structureTypeResponse.enumRepresentations[0].data[i].code
                    });
                }
            }
        });

        /**
         * This function will be used to link child account to form the tree structure.
         *
         * @memberOf assemble-structure
         * @function manageAccountList
         * @param {string} accountNo - Account id the account to be managed in acocunt list.
         * @param {string} action - Action to be taken on the provided account. Action could be "add"/"remove".
         * @returns {void}
         */
        function manageAccountList(accountNo, action) {
            switch (action) {
                case "add":
                    {
                        const account = ko.utils.arrayFirst(originalSelectedAccountArray, function(element) {
                            return element.accountDetails.accountKey.accountNo.value === accountNo;
                        });

                        if (account) {
                            account.instructionPriority = ko.observable();
                            self.structureAccounts.push(account);
                            self.structureAccounts[self.structureAccounts.length - 1].selectedAccount = ko.observableArray();

                            if (rootParams.structureType() === "Sweep" && self.structureAccounts.length === originalSelectedAccountArray.length) {
                                selectHeaderAccount();
                            }
                        } else {
                            selectHeaderAccount();
                        }

                        break;
                    }
                case "remove":
                    for (let i = 0; i < self.structureAccounts.length; i++) {
                        if (self.structureAccounts[i].accountDetails.accountKey.accountNo.value === accountNo) {
                            self.structureAccounts.splice(i, 1);
                            break;
                        }
                    }

                    break;
            }
        }

        if (rootParams.existingStructureAccountsArray() && rootParams.existingStructureAccountsArray().length) {
            for (let j = 0; j < self.existingStructureAccountsArray().length; j++) {
                manageAccountList(self.existingStructureAccountsArray()[j], "remove");
            }
        }

        /**
         * This function will be used to link child account to form the tree structure.
         *
         * @memberOf assemble-structure
         * @function linkChilds
         * @param {Object} data - Of the selected node on which link is to be done.
         * @param {Object} parentAccount - The root account to be mapped.
         * @param {Object} linkAccountList - An array containing the list of accounts to be linked from the overlay.
         * @param {Object} cashCCMethod - Cash concentration method of the linking account.
         * @returns {void}
         */
        function linkChilds(data, parentAccount, linkAccountList, cashCCMethod) {
            self.refreshTree(false);

            if (data.account && data.account.accountDetails.accountKey.accountNo.value === parentAccount) {
                const existingChildLength = data.children.length;

                for (let k = 0; k < linkAccountList.length; k++) {
                    if (parentAccount !== "xxxxxxxxxxxxxxxx") {
                        linkAccountList[k].parentAccountKey = data.account.accountDetails.accountKey;
                    }

                    linkAccountList[k].instructionList = "";
                    linkAccountList[k].percentageShare = 0;
                    linkAccountList[k].level = data.account.level + 1;
                    linkAccountList[k].allowRevSweep = false;
                    linkAccountList[k].hold = false;
                    linkAccountList[k].rateType = "STANDARD";
                    linkAccountList[k].eodexecution = false;
                    linkAccountList[k].baseAmt = 0;
                    linkAccountList[k].thirdPartAccountChk = false;
                    linkAccountList[k].sweepDirection = "";
                    linkAccountList[k].paymentInstructionList = "";
                    linkAccountList[k].cashCCMethod = cashCCMethod;

                    const childData = {
                        account: linkAccountList[k],
                        children: []
                    };

                    data.children[existingChildLength + k] = childData;
                    manageAccountList(linkAccountList[k].accountDetails.accountKey.accountNo.value, "remove");
                }
            } else {
                for (let i = 0; i < data.children.length; i++) {
                    if (data.children[i].children) {
                        data.children[i] = linkChilds(data.children[i], parentAccount, linkAccountList, cashCCMethod);
                    } else if (!data.children[i].children) {
                        data.children[i].children = [];
                        data.children[i] = linkChilds(data.children[i], parentAccount, linkAccountList, cashCCMethod);
                    }
                }
            }

            ko.tasks.runEarly();
            self.refreshTree(true);

            return data;
        }

        const selectedHeaderAccount = self.selectedHeaderAccount.subscribe(function(headerValue) {
            if (headerValue) {
                ko.utils.extend(headerValue, {
                    instructionList: "",
                    paymentInstructionList: "",
                    percentageShare: 0,
                    level: 0,
                    cx: 0,
                    cy: 0,
                    eodexecution: false,
                    baseAmt: 0,
                    thirdPartAccountChk: false,
                    allowRevSweep: "",
                    hold: false
                });

                self.treeData({
                    account: headerValue,
                    children: []
                });

                manageAccountList(headerValue.accountDetails.accountKey.accountNo.value, "remove");

                if (isIE()) {
                    self.reset("table");
                    self.isIEBrowser(true);
                } else {
                    self.isIEBrowser(false);
                }

                self.headerAccountDetailsLoaded(true);
            }
        });

        self.childSelectionCallback = function(linkAccountList, cashCCMethod) {
            self.selectedAccountArray(linkAccountList);
            self.isValidated(false);
            self.treeData(linkChilds(self.treeData(), self.nodeAccount(), linkAccountList, cashCCMethod || self.structureType));
        };

        self.menuItems = [{
            id: "link",
            label: self.resources.labels.link
        }, {
            id: "delete",
            label: self.resources.labels.remove
        }, {
            id: "replace",
            label: self.resources.labels.replace
        }];

        /**
         * This function will be used to open the menu option from the nodes of the tree containing link and delete options.
         *
         * @memberOf assemble-structure
         * @function openMenu
         * @param {Object} data - To be passed for specific operation.
         * @param {Object} event - To be used to capture the event.
         * @returns {void}
         */
        self.openMenu = function(data, event) {
            if (self.viewas() === "tree") {
                $("#menuLauncher-viewStructure-contents-" + data.nodeData.accountDetails.accountKey.accountNo.value).ojMenu("open", event);
            } else if (self.viewas() === "table") {
                $("#menuLauncher-viewStructure-contents-" + data.accountDetails.accountKey.accountNo.value).ojMenu("open", event);
            }
        };

        /**
         * Adds account back to account list.
         *
         * @memberOf assemble-structure
         * @function addAccountBackToAccountList
         * @param {Object} data - Account object that is removed from tree and is to be added back to the account list.
         * @returns {void}
         */
        function addAccountBackToAccountList(data) {
            manageAccountList(data.account.accountDetails.accountKey.accountNo.value, "add");

            if (data.children) {
                for (let i = 0; i < data.children.length; i++) {
                    addAccountBackToAccountList(data.children[i]);
                }
            }
        }

        /**
         * This function will be used to recursively search the tree for the specified key to delete from the tree nodes.
         *
         * @memberOf assemble-structure
         * @function removeChild
         * @param {Object} key - Account number of the node selected for removal from the tree structure.
         * @param {Object} treeData - Contains the whole tree structure payload.
         * @returns {void}
         */
        function removeChild(key, treeData) {
            if (treeData && treeData.account) {
                if (key === treeData.account.accountDetails.accountKey.accountNo.value) {
                    return {
                        matched: true,
                        data: treeData
                    };
                }

                if (treeData.children && treeData.children.length) {
                    for (let a = 0; a < treeData.children.length; a++) {
                        const removeChildData = removeChild(key, treeData.children[a]);

                        treeData.children[a] = removeChildData.data;

                        if (removeChildData.matched) {
                            addAccountBackToAccountList(treeData.children[a]);
                            treeData.children.splice(a, 1);
                            break;
                        }
                    }
                }
            }

            return {
                matched: false,
                data: treeData
            };
        }

        /**
         * This function will trigger replace node flow.
         *
         * @memberOf assemble-structure
         * @function triggerReplaceFlow
         * @returns {void}
         */
        function triggerReplaceFlow() {
            rootParams.dashboard.openRightPanel("select-structure-account", {
                accountlist: self.structureAccounts,
                mode: "replace",
                selectedHeaderAccount: self.selectedReplaceAccount
            }, self.resources.labels.replaceOverlayHeader);
        }

        /**
         * This function will replace a node with selected account.
         *
         * @memberOf assemble-structure
         * @function replaceNode
         * @param {Object} data - Account and child data.
         * @param {Object} replace - Account number of the node to be replaced.
         * @param {Object} replaceWith - Account number by which node is to be replaced.
         * @param {Object} replaced - Flag to identify whether replace activity is done.
         * @returns {boolean} Whether replacement activity is done or not.
         */
        function replaceNode(data, replace, replaceWith, replaced) {
            if (data.account.accountDetails.accountKey.accountNo.value === replace) {
                replaceWith.instructionPriority = data.account.instructionPriority;
                replaceWith.level = data.account.level;
                replaceWith.instructionList = data.account.instructionList;
                replaceWith.parentAccountKey = data.account.parentAccountKey;
                ko.utils.extend(data.account, replaceWith);

                if (data.children && data.children.length) {
                    for (let i = 0; i < data.children.length; i++) {
                        data.children[i].account.parentAccountKey = data.account.accountDetails.accountKey;
                    }
                }

                replaced = true;
            } else if (!replaced) {
                for (let i = 0; i < data.children.length; i++) {
                    if (replaceNode(data.children[i], replace, replaceWith, replaced)) {
                        break;
                    }
                }
            }

            return replaced;
        }

        self.selectedReplaceAccount.subscribe(function(replaceWith) {
            self.refreshTree(false);
            replaceNode(self.treeData(), self.nodeAccount(), replaceWith, false);
            manageAccountList(replaceWith.accountDetails.accountKey.accountNo.value, "remove");
            manageAccountList(self.nodeAccount(), "add");
            ko.tasks.runEarly();
            self.refreshTree(true);
        });

        /**
         * This function will be used to open the menu option from the nodes of the tree containing link and delete options.
         *
         * @memberOf assemble-structure
         * @function menuItemSelect
         * @param {string} accountNo - Account number of the node on which link/remove action is to performed.
         * @param {Object} event - To be used to capture the event of the menu option.
         * @returns {void}
         */
        self.menuItemSelect = function(nodeData, event) {
            if (event.target.value === "link") {
                self.linkAccountClicked(nodeData.accountDetails.accountKey.accountNo.value, nodeData.cashCCMethod, nodeData.level);
            } else if (event.target.value === "delete") {
                self.nodeAccount(nodeData.accountDetails.accountKey.accountNo.value);
                $("#removeNodeDialog").trigger("openModal");
            } else if (event.target.value === "replace") {
                self.nodeAccount(nodeData.accountDetails.accountKey.accountNo.value);
                triggerReplaceFlow();
            }
        };

        /**
         * This function will be used remove account selection when child account linking overlay is closed.
         *
         * @memberOf assemble-structure
         * @function linkChildsCloseHandler
         * @returns {void}
         */
        function linkChildsCloseHandler() {
            for (let i = 0; i < self.structureAccounts.length; i++) {
                self.structureAccounts[i].selectedAccount.removeAll();
                self.structureAccounts[i].instructionPriority(null);
            }
        }

        self.linkAccountClicked = function(accountNo, cashCCMethod, level) {
            self.nodeAccount(accountNo);

            let defaultCashCCMethod;

            if (cashCCMethod && cashCCMethod === "Sweep") {
                defaultCashCCMethod = "Sweep";
            } else if (!cashCCMethod || !level) {
                defaultCashCCMethod = "Pool";
            } else {
                defaultCashCCMethod = null;
            }

            rootParams.dashboard.openRightPanel("select-structure-account", {
                mode: "link",
                accountlist: self.structureAccounts,
                selectedAccountArray: self.selectedAccountArray,
                accountSelectionCallBack: self.childSelectionCallback,
                structureType: rootParams.structureType(),
                structureTypeList: self.structureTypeList(),
                defaultCashCCMethod: defaultCashCCMethod,
                setPriority: true
            }, self.resources.labels.childAccountLinkHeader, linkChildsCloseHandler);
        };

        /**
         * This function is used to remove the account from the tree.
         *
         * @memberOf assemble-structure
         * @function remove
         * @returns {void}
         */
        self.remove = function() {
            self.refreshTree(false);
            self.isValidated(false);

            const refreshedTreeData = removeChild(self.nodeAccount(), self.treeData());

            if (refreshedTreeData.matched) {
                self.headerAccountDetailsLoaded(false);
                addAccountBackToAccountList(self.treeData());
                self.treeData({});
                rootParams.existingStructureAccountsArray.removeAll();
                self.selectedHeaderAccount(null);
            } else {
                self.treeData(refreshedTreeData.data);
            }

            ko.tasks.runEarly();
            self.refreshTree(true);
            $("#removeNodeDialog").trigger("closeModal");
        };

        /**
         * This function is used to close the modal window info for node removal from tree.
         *
         * @memberOf assemble-structure
         * @function  closeModal
         * @returns {void}
         */
        self.closeModal = function() {
            $("#removeNodeDialog").trigger("closeModal");
        };

        /**
         * This recursive function will be used to reshaping the tree payload for validation of the structure.
         *
         * @memberOf assemble-structure
         * @function generateStructureValidatePayload
         * @param {Object} treeData - To be passed for reshaping.
         * @param {boolean} pushAccount - Flag to identify whether the account is to be pushed in the account list or not.
         * @returns {void}
         */
        function generateStructureValidatePayload(treeData, pushAccount) {
            if (treeData.account && pushAccount) {
                accountlst.push(treeData.account);
            }

            if (treeData.children && treeData.children.length) {
                for (let a = 0; a < treeData.children.length; a++) {
                    generateStructureValidatePayload(treeData.children[a], true);
                }
            }

            for (let b = 0; b < accountlst.length; b++) {
                delete accountlst[b].accountNo;
                delete accountlst[b].audit;
                delete accountlst[b].balCompParticpationChk;
                delete accountlst[b].bankId;
                delete accountlst[b].bankType;
                delete accountlst[b].bicCode;
                delete accountlst[b].casaBlockedAmount;
                delete accountlst[b].country;
                delete accountlst[b].customerId;
                delete accountlst[b].lastBalUpdatedTime;
                delete accountlst[b].limitCcy;
                delete accountlst[b].locationUTC;
                delete accountlst[b].multipleStrCheck;
                delete accountlst[b].notionalAccFlag;
                delete accountlst[b].selectedAccount;
            }

            self.finalPayload(accountlst);
        }

        /**
         * This function will be used to validate structure based on input payload.
         *
         * @memberOf assemble-structure
         * @function validateStructure
         * @returns {void}
         */
        self.validateStructure = function() {
            accountlst = [];
            generateStructureValidatePayload(self.treeData(), self.structureType === "Sweep" || self.structureDetails().structureList()[0].structureKey.versionNo() > 1);
            self.structureDetails().structureList()[0].accountlst(self.finalPayload());

            assembleStructureModel.validateStructure(ko.mapping.toJSON(self.structureDetails)).then(function(response) {
                if (response.jsonNode.txStatus) {
                    document.getElementById("message-box").closeAll();
                    self.isValidated(true);
                    rootParams.baseModel.showMessages(null, [self.resources.message.validateSuccess], "INFO");
                } else {
                    rootParams.baseModel.showMessages(null, [response.jsonNode.errorMsg], "ERROR");
                }
            }).catch(function(response) {
                if (!response.responseJSON.jsonNode.txStatus && response.responseJSON.jsonNode.errorMsg) {
                    rootParams.baseModel.showMessages(null, [response.responseJSON.jsonNode.errorMsg], "ERROR");
                }
            });
        };

        /**
         * This function is used to set mode to tree view.
         *
         * @memberOf assemble-structure
         * @function setTreeView
         * @returns {void}
         */
        self.setTreeView = function() {
            self.reset("tree");
        };

        /**
         * This function is used to set mode to tabular view.
         *
         * @memberOf assemble-structure
         * @function setTabularView
         * @returns {void}
         */
        self.setTabularView = function() {
            self.reset("table");
        };

        /**
         * This function will be used to go to next component.
         *
         * @memberOf assemble-structure
         * @function next
         * @returns {void}
         */
        self.next = function() {
            document.getElementById("message-box").closeAll();
            rootParams.stageChangeHandler("assemble-structure", self.treeData(), "next");
        };

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed function variables.
         *
         * @memberOf assemble-structure
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            selectedHeaderAccount.dispose();
        };
    };
});
/**
 * view-structure-tree contains all the methods to view a structure in different in tree format.
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} structureModel
 * @requires {object} ResourceBundle
 */
define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-structure",
    "ojs/ojknockout",
    "ojs/ojmenu",
    "ojs/ojoption"
], function(ko, $, structureModel, ResourceBundle) {
    "use strict";

    /** View structure in multiple view format.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this,

            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(structureModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.structureDetails = ko.observable();
        self.structureDetailsLoaded = ko.observable(false);
        self.resources = ResourceBundle;
        self.selectedMenuItem = ko.observable();
        self.editStructureData = ko.observable();
        self.nodeData = ko.observableArray();
        self.cashCCMethod = ko.observable();

        self.isIEBrowser = ko.observable(false);

        /* Sample function that returns boolean in case the browser is Internet Explorer*/
        function isIE() {
            const ua = navigator.userAgent,
                is_ie = ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1;

            return is_ie;
        }

        /**
         * This function will be used to select details based on selected mode.
         *
         * @memberOf view-structure
         * @function structModifyMode
         * @returns {void}
         */
        function structModifyMode() {
            if (self.params.mode !== "view" && self.params.mode !== "Resumed" && self.params.mode !== "Paused" && self.params.mode !== "execute") {
                self.StructureModifymode = self.params ? self.params.createStructureModel ? self.params.createStructureModel.structureList()[0].structureStatus : null : null;
            } else {
                self.StructureModifymode = self.params ? self.params.structureDetails ? self.params.structureDetails.structureStatus : null : null;
            }
        }

        structModifyMode();

        self.pauseStructureModel = getNewKoModel().pauseStructureModel;
        self.modifiedStructureDetails = ko.observable();
        self.AccountListArray = ko.observableArray();
        self.response = ko.observable();
        self.viewas = ko.observable(self.params && self.params.viewas ? self.params.viewas : "tree");

        /**
         * This function will be used to mode based on its previous component.
         *
         * @memberOf view-structure
         * @function selectMode
         * @returns {void}
         */
        function selectMode() {
            if (self.params.mode !== "approval" && self.params.mode !== "view" && self.params.mode !== "Resumed" && self.params.mode !== "Paused" && self.params.mode !== "execute" && self.params.mode !== "edit") {
                self.mode = self.mode || ko.observable("review");
            } else {
                self.mode = ko.observable(self.params.mode);
            }
        }

        selectMode();

        self.customerDesc = ko.observable();

        rootParams.baseModel.registerComponent("edit-structure", "liquidity-management");
        rootParams.baseModel.registerComponent("list-structure", "liquidity-management");
        rootParams.baseModel.registerComponent("tree-view", "liquidity-management");
        rootParams.baseModel.registerComponent("create-structure", "liquidity-management");
        rootParams.baseModel.registerComponent("view-instruction-details", "liquidity-management");
        rootParams.baseModel.registerComponent("view-structure-tabular", "liquidity-management");
        rootParams.baseModel.registerComponent("view-structure-details", "liquidity-management");
        rootParams.baseModel.registerComponent("set-pool-instructions", "liquidity-management");
        rootParams.baseModel.registerElement(["page-section", "confirm-screen"]);

        let structureId, structureData,keyId;

        function fetchData() {
            if (self.params.mode !== "view" && self.params.mode !== "Resumed" && self.params.mode !== "Paused" && self.params.mode !== "execute") {
                structureId = self.params ? self.params.createStructureModel ? self.params.createStructureModel.structureList()[0].structureKey.structureId : null : null;
                structureData = rootParams.rootModel.params ? ko.mapping.toJS(rootParams.rootModel.params.createStructureModel.structureList()[0]) : null;
            } else {
                keyId = self.params ? self.params.keyId : self.keyId;
                structureId = self.params ? self.params.structureId : self.structureId;
                structureData = rootParams.rootModel.params.structureDetails ? ko.mapping.toJS(rootParams.rootModel.params.structureDetails) : null;
            }
        }

        if(self.mode() !== "approval"){
            fetchData();
        }

        if (self.mode() === "view") {
            rootParams.dashboard.headerName(self.resources.structure.header);
        }

        self.menuItems = [{
            id: "viewDetails",
            label: self.resources.structure.viewDetails,
            icon: "icon icon-eye"
        }, {
            id: "editStructure",
            label: self.resources.structure.editStructure,
            icon: "icon icon-remarks"
        }].concat(self.StructureModifymode === "Resumed" ? [{
            id: "executeStructure",
            label: self.resources.structure.executeStructure,
            icon: "icon icon-ok"
        }, {
            id: "structureStatus",
            label: self.resources.structure.pauseStructure,
            icon: "icon icon-pause"
        }] : [{
            id: "structureStatus",
            label: self.resources.structure.resumeStructure,
            icon: "icon icon-resume"
        }]).concat([{
            id: "download",
            label: self.resources.structure.downloadPdf,
            icon: "icon icon-download"
        }]);

        /**
         * A recursive function called to fetch the specified node details in overlay format.
         *
         * @memberOf view-structure
         * @function detailView
         * @returns {void}
         */
        self.detailView = function() {
            rootParams.dashboard.openRightPanel("view-structure-details", {
                structureId: structureId,
                structureDetails: structureData,
                mode: self.mode()
            }, self.resources.structureDetail.labels.structureDetail);
        };

        /**
         * A recursive function called to fetch the specified node details.
         *
         * @memberOf view-structure
         * @function getNodeLinkDetails
         * @param {Object} startId - - - - - - - - - - - - - - Contains account of specified node.
         * @param {Object} endId Contains account of specified node.
         * @param {object} accountlst Contains details of structure.
         * @returns {array} NodeData contains details of specified node.
         */
        function getNodeLinkDetails(startId, endId, accountlst) {
            if (accountlst) {
                if (accountlst.account.accountDetails.accountKey.accountNo.value === startId) {
                    self.nodeData.push(accountlst.account);
                } else if (accountlst.account.accountDetails.accountKey.accountNo.value === endId) {
                    const account = {
                        account: accountlst.account
                    };

                    self.nodeData.push(account);
                }

                if (accountlst.children && accountlst.children.length) {
                    for (let i = 0; i < accountlst.children.length; i++) {
                        getNodeLinkDetails(startId, endId, accountlst.children[i]);
                    }
                }

                return self.nodeData;
            }
        }

        self.linkClicked = function(id) {
                self.nodeData.removeAll();

                if (self.structureDetails() && self.structureDetails().accountlst.children) {
                    const startId = id.split("-")[0],
                        endId = id.split("-")[1],
                        nodeDetails = getNodeLinkDetails(startId, endId, self.structureDetails().accountlst);

                    if (nodeDetails() && nodeDetails()[1].account.cashCCMethod === "Sweep") {
                        rootParams.dashboard.openRightPanel("view-instruction-details", {
                            nodeDetails: nodeDetails,
                            structureDetails: self.structureDetails()
                        }, self.resources.structure.instructionDetails);
                    } else if (nodeDetails() && nodeDetails()[1].account && nodeDetails()[1].account.cashCCMethod === "Pool") {
                        rootParams.dashboard.openRightPanel("set-pool-instructions", {
                            structureDetails: self.structureDetails(),
                            nodeDetails: nodeDetails
                        }, self.resources.structure.reallocationMethod);
                    }
                }
        };

        /**
         * This function will be used as a reursive one to create an array of account details from tree response.
         *
         * @memberOf view-structure
         * @function convertTreeToArray
         * @param {Object} accountlist - To be passed for array creation.
         * @returns {void}
         */
        function convertTreeToArray(accountlist) {
            self.AccountListArray.push(accountlist.account);

            if (accountlist.children) {
                if (accountlist.children.constructor !== Array) {
                    accountlist.children = [accountlist.children];
                }

                for (let i = 0; i < accountlist.children.length; i++) {
                    convertTreeToArray(accountlist.children[i]);
                }
            }
        }

        /**
         * This function will be used to delete unnecessary details from request payload for pause structure.
         *
         * @memberOf view-structure
         * @function removeAttributes
         * @param {Object} jsondata - To be passed for modification.
         * @returns {void}
         */
        function removeAttributes(jsondata) {
            for (let i = 0; i < jsondata.accountlst.length; i++) {
                delete jsondata.accountlst[i].accountDetails.availableBalance;
                delete jsondata.accountlst[i].accountDetails.bankId;
                delete jsondata.accountlst[i].accountDetails.bankName;
                delete jsondata.accountlst[i].accountDetails.locationUTC;
                delete jsondata.accountlst[i].accountDetails.bankType;
                delete jsondata.accountlst[i].accountDetails.casaBlockedAmount;
                delete jsondata.accountlst[i].accountDetails.availableBalance;
                delete jsondata.accountlst[i].accountDetails.country;
                delete jsondata.accountlst[i].accountDetails.currentBalance;
                delete jsondata.accountlst[i].accountDetails.lastBalUpdatedTime;
                delete jsondata.accountlst[i].accountDetails.limitCcy;
                delete jsondata.accountlst[i].accountDetails.locationUTC;
                delete jsondata.accountlst[i].forceDebitBeyondLine;
                delete jsondata.accountlst[i].isNominatedAcc;
                delete jsondata.accountlst[i].multipleAmt;
                delete jsondata.accountlst[i].partialReverseSweep;
                delete jsondata.accountlst[i].partialTransferAllowedChk;
                delete jsondata.accountlst[i].reallocReqdChk;
                delete jsondata.accountlst[i].status;
                delete jsondata.accountlst[i].onlineBalFetch;
            }

            delete jsondata.onlineBalFetch;
            delete jsondata.headerAccount;
            delete jsondata.customerDesc;
        }

        /**
         * This function will be used to create request payload for pause structure.
         *
         * @memberOf view-structure
         * @function pauseStructure
         * @returns Object pauseStructureModel model data to pause or resume structure.
         */
        self.pauseStructure = function() {
            self.modifiedStructureDetails(self.response());
            convertTreeToArray(self.modifiedStructureDetails().accountlst);
            self.modifiedStructureDetails().accountlst = self.AccountListArray();
            self.pauseStructureModel.structureList = [self.modifiedStructureDetails()];

            $.extend(self.pauseStructureModel.structureList, self.modifiedStructureDetails());
            removeAttributes(self.pauseStructureModel.structureList[0]);
            self.pauseStructureModel.structureList[0].structureKey.versionNo = self.pauseStructureModel.structureList[0].structureKey.versionNo + 1;
            self.pauseStructureModel.structureList[0].structureStatus = self.pauseStructureModel.structureList[0].structureStatus === "Resumed" ? "Paused" : "Resumed";
            self.pauseStructureModel.structureList[0].customerId = rootParams.dashboard.userData.userProfile.partyId.value;

            return self.pauseStructureModel;
        };

        let payload;

        /**
         * This function will fetch target value from the menu and operates as per instructions.
         *
         * @memberOf view-structure
         * @function loadReviewScreen
         * @param {object} mode contains mode for review screen
         * @returns {void}
         */

        function loadReviewScreen(mode) {
            rootParams.dashboard.loadComponent("edit-structure", {
                mode: mode,
                keyId: self.structureDetails().keyId,
                structureDetails: self.structureDetails(),
                structureId: self.structureDetails().structureId,
                payload: payload
            });
        }

        self.back = function(){
            if(self.mode() === "Resumed" || self.mode() === "Paused"){
                self.structureDetails().structureStatus = self.mode();
            }

            rootParams.dashboard.loadComponent("view-structure", {
                mode: "view",
                keyId: self.structureDetails().keyId,
                structureDetails: self.structureDetails(),
                structureId: self.structureDetails().structureId,
                payload: payload
            });
        };

        /**
         * This function will fetch target value from the menu and operates as per instructions.
         *
         * @memberOf view-structure
         * @function menuItemAction
         * @param {Object} event - Contains menu context.
         * @returns {void}
         */
        self.menuItemAction = function(event) {
            self.selectedMenuItem(event.target.value);

            if (self.selectedMenuItem() === "viewDetails") {
                rootParams.dashboard.openRightPanel("view-structure-details", {
                    params: {
                        structureDetails: self.structureDetails(),
                        mode: self.mode()
                    }
                }, self.resources.structure.viewDetailsHeader);
            } else if (self.selectedMenuItem() === "structureStatus") {
                payload = self.pauseStructure();

                if (payload) {
                    loadReviewScreen(self.StructureModifymode);
                }
            } else if (self.selectedMenuItem() === "executeStructure") {
                loadReviewScreen("execute");
            } else if (self.selectedMenuItem() === "download") {
                $("#passwordDialog").trigger("openModal");
                structureModel.fetchPDF(keyId);
            } else if (self.selectedMenuItem() === "editStructure") {
                rootParams.dashboard.loadComponent("create-structure", {
                    mode: "edit",
                    editStructureModel: self.editStructureData()
                });
            }
        };

        /**
         * This function is used to open menu list to handle particular operation.
         *
         * @memberOf view-structure
         * @function openMenu
         * @param {Object} event - Contains menu context.
         * @returns {void}
         */
        self.openMenu = function(event) {
            $("#myMenu1").ojMenu("open", event);
        };

        /**
         * This function is used to set mode to tree view.
         *
         * @memberOf view-structure
         * @function setTreeView
         * @returns {void}
         */
        self.setTreeView = function() {
            self.reset("tree");
        };

        /**
         * This function is used to set mode to tabular view.
         *
         * @memberOf view-structure
         * @function setTabularView
         * @returns {void}
         */
        self.setTabularView = function() {
            self.reset("table");
        };

        /**
         * This function is used to close the modal window info for password notification.
         *
         * @memberOf view-sweep-log
         * @function  closeModal
         * @returns {void}
         */
        self.closeModal = function() {
            $("#passwordDialog").trigger("closeModal");
        };

        /**
         * This function is used to refresh data based on selected icon on screen.
         *
         * @memberOf view-structure
         * @function reset
         * @param {Object} data - To be passed to refresh.
         * @returns {void}
         */
        self.reset = function(data) {
            self.structureDetailsLoaded(false);
            self.viewas(data);
            self.structureDetailsLoaded(true);
        };

        /**
         * This function handles structure read response.
         *
         * @memberOf view-structure
         * @function structureResponseHandler
         * @param {Object} treeResponse - Structure response object.
         * @returns {void}
         */
        function structureResponseHandler(treeResponse) {
            if (treeResponse && treeResponse.jsonNode.structureList) {
                self.editStructureData(treeResponse.jsonNode);
                self.structureDetails(treeResponse.jsonNode.structureList);
                self.response(treeResponse.jsonNode.structureList);
                self.customerDesc(treeResponse.jsonNode.structureList.customerDesc);
                self.cashCCMethod(self.structureDetails().accountlst.children[0] ? self.structureDetails().accountlst.children[0].account.cashCCMethod : self.structureDetails().accountlst.children.account.cashCCMethod);
            }

            if (isIE()) {
                self.reset("table");
                self.isIEBrowser(true);
            } else {
                self.isIEBrowser(false);
            }

            self.structureDetailsLoaded(true);
        }

        const accountsWithChild = {};

        /**
         * This extracts headers account from the given account list.
         *
         * @memberOf view-structure
         * @function getHeaderAccount
         * @param {Array} accountList - Array of accounts.
         * @returns {string} Identified header account.
         */
        function getHeaderAccount(accountList) {
            let headerAccount;

            if (structureData.structureType !== "Sweep" && structureData.structureKey.versionNo === 1) {
                headerAccount = {
                    accountDetails: {
                        accountDesc: self.resources.structure.notionalAccount,
                        customerDesc: self.customerDesc(),
                        accountKey: {
                            accountNo: {
                                displayValue: "xxxxxxxxxxxxxxxx",
                                value: "xxxxxxxxxxxxxxxx"
                            },
                            branchCode: structureData.systemAccBranch,
                            ccyId: structureData.systemAccCcy
                        }
                    }
                };
            }

            for (let i = 0; i < accountList.length; i++) {
                const key = accountList[i].parentAccountKey ? accountList[i].parentAccountKey.accountNo.value : "xxxxxxxxxxxxxxxx";

                if (!headerAccount && !accountList[i].parentAccountKey) {
                    headerAccount = accountList[i];
                } else if (!accountsWithChild[key]) {
                    accountsWithChild[key] = 1;
                } else if (accountsWithChild[key]) {
                    accountsWithChild[key] += 1;
                }
            }

            return headerAccount;
        }

        /**
         * This extracts all the child accounts of the given account.
         *
         * @memberOf view-structure
         * @function getChildrens
         * @param {Array} accountList - Array of accounts.
         * @param {string} accountId - Parent account of which childs are to be extracted.
         * @returns {Array} Array of child account of the given parent account.
         */
        function getChildrens(accountList, accountId) {
            if (Object.keys(accountsWithChild).indexOf(accountId) < 0) {
                return [];
            }

            const childArray = [];

            for (let i = 0; i < accountList.length; i++) {
                if ((accountList[i].parentAccountKey && accountList[i].parentAccountKey.accountNo.value === accountId) || (!accountList[i].parentAccountKey && accountId === "xxxxxxxxxxxxxxxx")) {
                    childArray.push({
                        account: accountList[i],
                        children: getChildrens(accountList, accountList[i].accountDetails.accountKey.accountNo.value)
                    });
                }

                if (accountsWithChild[accountId] === childArray.length) {
                    break;
                }
            }

            return childArray;
        }

        let confirmScreenDetailsArray;

        /**
         * Fetches confirm screen message.
         *
         * @memberOf view-structure
         * @function getConfirmScreenMsg
         * @returns {void}
         */
        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resources.structureDetail.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resources.structureDetail.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        /**
         * Fetches confirm screen status.
         *
         * @memberOf view-structure
         * @function getConfirmScreenStatus
         * @returns {void}
         */
        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resources.structureDetail.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resources.structureDetail.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        /**
         * This function is to download details in pdf.
         *
         * @memberOf view-structure
         * @function downloadPdf
         * @returns {void}
         */
        self.downloadPdf = function() {
            self.structureID(structureId);
            structureModel.fetchPDF(self.structureID());
        };

        /**
         * This function is the starting point of the component rendering.
         *
         * @memberOf view-structure
         * @function start
         * @returns {void}
         */
        function start(){
            if (structureData && Array.isArray(structureData.accountlst)) {
                const accountTree = {};

                if (structureData.structureType !== "Sweep") {
                    structureModel.getPartyDetails().then(function(response) {
                        self.customerDesc(response.party.personalDetails.fullName);
                    });
                }

                accountTree.account = getHeaderAccount(structureData.accountlst);
                accountTree.children = getChildrens(structureData.accountlst, accountTree.account.accountDetails.accountKey.accountNo.value);
                structureData.accountlst = accountTree;

                structureResponseHandler({
                    jsonNode: {
                        structureList: structureData
                    }
                });
            } else {
                structureModel.viewStructure(keyId).then(structureResponseHandler);
            }
        }

        /**
         * Populates confirm screen extensions object.
         *
         * @memberOf view-structure
         * @function populateConfirmScreenExtension
         * @returns {void}
         */
        function populateConfirmScreenExtension(autoStart) {
            confirmScreenDetailsArray = [
                [{
                    label: self.resources.structureDetail.labels.structureId,
                    value: structureId
                }, {
                    label: self.resources.structureDetail.labels.structureDescription,
                    value: structureData.desc
                }],
                [{
                    label: self.resources.structureDetail.labels.startDate,
                    value: structureData.effDate,
                    isDate: true
                }, {
                    label: self.resources.structureDetail.labels.endDate,
                    value: structureData.endDate,
                    isDate: true
                }],
                [{
                    label: self.resources.structureDetail.labels.structureType,
                    value: structureData.structureType
                }]
            ];

            $.extend(self.confirmScreenExtensions, {
                isSet: true,
                taskCode: self.params.taskCode,
                download: self.downloadPdf,
                resource: self.resources,
                confirmScreenDetails: confirmScreenDetailsArray,
                confirmScreenMsgEval: self.getConfirmScreenMsg,
                confirmScreenStatusEval: self.getConfirmScreenStatus,
                template: "confirm-screen/liquidity-management-template"
            });

            if(autoStart){
                start();
            }
        }

        if (self.mode() === "approval") {

            switch (self.params.taskCode) {
                case "LM_M_MSR":
                case "LM_M_MSP":
                case "LM_M_CNS":
                case "LM_M_ES":
                    structureData = self.params.data.requestPayload.structureList[0];
                    structureId = self.params.data.requestPayload.structureList[0].structureKey.structureId;
                    populateConfirmScreenExtension(true);
                    break;
                case "LM_M_IMS":
                    structureId = self.params.data.requestPayload.strListKeyDTO[0].structureId;

                    structureModel.viewStructureByStructureId(structureId).then(function(data) {
                        structureData = data.jsonNode.structureList;
                        populateConfirmScreenExtension();
                        structureResponseHandler(data);
                    });

                    break;
                default:
                    break;
            }
        } else if (self.mode() === "review" || self.mode() === "edit") {
            rootParams.dashboard.headerName(self.mode() === "edit" ? self.resources.structureDetail.labels.editStructure : self.resources.structureDetail.labels.createStructure);
            populateConfirmScreenExtension(true);
        } else if (self.mode() === "Paused" || self.mode() === "Resumed") {
            rootParams.dashboard.headerName(self.mode() === "Paused" ? self.resources.structureDetail.labels.resumeStructure : self.resources.structureDetail.labels.pausedStructure);
            populateConfirmScreenExtension(true);
        } else if (self.mode() === "execute") {
            structureModel.init(self.params.structureDetails.structureKey.structureId, structureData.structureKey.versionNo, rootParams.dashboard.userData.userProfile.partyId.value, structureData.desc);
            rootParams.dashboard.headerName(self.resources.structureDetail.labels.executeStructure);
            populateConfirmScreenExtension(true);
        } else {
            populateConfirmScreenExtension(true);
        }

        /**
         *  Confirms transactions based on mode and process confirm screeen.
         *
         * @memberOf view-structure
         * @function confirm
         * @returns {void}
         */
        self.confirm = function() {
            if (self.mode() === "edit") {
                structureModel.editStructure(ko.mapping.toJSON(self.params.createStructureModel)).then(function(response) {
                    if (response.jsonNode && !response.jsonNode.txStatus) {
                        rootParams.baseModel.showMessages(null, [response.jsonNode.errorMsg], "ERROR");
                    } else {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: response,
                            transactionName: self.resources.structureDetail.labels.editStructure,
                            confirmScreenExtensions: {
                                isSet: true,
                                download: self.downloadPdf,
                                taskCode: "LM_M_ES",
                                resource: self.resources,
                                confirmScreenDetails: confirmScreenDetailsArray,
                                template: "confirm-screen/liquidity-management-template"
                            }
                        }, self);
                    }
                }).catch(function(response) {
                    if (!response.responseJSON.txStatus && response.responseJSON.errorMsg) {
                        rootParams.baseModel.showMessages(null, [response.responseJSON.errorMsg], "ERROR");
                    }
                });
            } else if (self.mode() === "review") {
                structureModel.createStructure(ko.mapping.toJSON(self.params.createStructureModel)).then(function(response) {
                    if (response.jsonNode && !response.jsonNode.txStatus) {
                        rootParams.baseModel.showMessages(null, [response.jsonNode.errorMsg], "ERROR");
                    } else {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: response,
                            transactionName: self.resources.structureDetail.labels.createNewStructure,
                            confirmScreenExtensions: {
                                isSet: true,
                                download: self.downloadPdf,
                                taskCode: "LM_M_CNS",
                                resource: self.resources,
                                confirmScreenDetails: confirmScreenDetailsArray,
                                template: "confirm-screen/liquidity-management-template"
                            }
                        }, self);
                    }
                }).catch(function(response) {
                    if (!response.responseJSON.txStatus && response.responseJSON.errorMsg) {
                        rootParams.baseModel.showMessages(null, [response.responseJSON.errorMsg], "ERROR");
                    }
                });
            } else if (self.mode() === "execute") {
                structureModel.executeStructure(ko.mapping.toJSON(getNewKoModel().executeStructureModel)).then(function(response) {
                    if ((response.jsonNode && response.jsonNode.txStatus) || !response.jsonNode) {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: response,
                            transactionName: self.resources.structureDetail.labels.executeStructure,
                            confirmScreenExtensions: {
                                isSet: true,
                                taskCode: "LM_M_ES",
                                confirmScreenMsgEval: function() {
                                    return self.resources.structureDetail.messages.executeSuccesMessage;
                                },
                                confirmScreenDetails: confirmScreenDetailsArray,
                                template: "confirm-screen/liquidity-management-template"
                            }
                        }, self);
                    } else {
                        rootParams.baseModel.showMessages(null, [response.jsonNode.errorMsg], "ERROR");
                    }
                }).catch(function(response) {
                    if (response.responseJSON.jsonNode && !response.responseJSON.jsonNode.txStatus && response.responseJSON.jsonNode.errorMsg) {
                        rootParams.baseModel.showMessages(null, [response.responseJSON.jsonNode.errorMsg], "ERROR");
                    }
                });

            } else if (self.mode() === "Paused" || self.mode() === "Resumed") {
                structureModel.pauseStructure(ko.mapping.toJSON(self.params.payload), self.params.payload.structureList[0].structureStatus === "Resumed" ? "resume" : "pause").then(function(response) {
                    if ((response.jsonNode && response.jsonNode.txStatus) || (!response.jsonNode && !response.errorMsg)) {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: response,
                            transactionName: self.mode() === "Paused" ? self.resources.structureDetail.labels.resumeStructure : self.resources.structureDetail.labels.pausedStructure,
                            confirmScreenExtensions: {
                                isSet: true,
                                taskCode: self.mode() === "Paused" ? "LM_M_MSR" : "LM_M_MSP",
                                successMessage: self.mode() === "Resumed" ? self.resources.structureDetail.messages.pauseSuccesMessage : self.resources.structureDetail.messages.resumeSuccesMessage,
                                statusMessages: self.mode() === "Resumed" ? self.resources.structureDetail.messages.pauseSuccesMessage : self.resources.structureDetail.messages.resumeSuccesMessage,
                                confirmScreenDetails: confirmScreenDetailsArray,
                                template: "confirm-screen/liquidity-management-template"
                            }
                        }, self);
                    } else {
                        rootParams.baseModel.showMessages(null, [response.jsonNode.errorMsg], "ERROR");
                    }
                }).catch(function(response) {
                    if (response.responseJSON.jsonNode && !response.responseJSON.jsonNode.txStatus && response.responseJSON.jsonNode.errorMsg) {
                        rootParams.baseModel.showMessages(null, [response.responseJSON.jsonNode.errorMsg], "ERROR");
                    }
                });

            }
        };

    };
});
/**
 * edit-structure-instructions contains all the methods to edit a instruction.
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([
    "knockout",
    "ojL10n!resources/nls/edit-structure-instructions",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojdatetimepicker",
    "ojs/ojpopup"
], function(ko, ResourceBundle) {
    "use strict";

    /** Edit-structure-instructions.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     *
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.resources = ResourceBundle;
        self.editStructureInstructions = ko.observable(rootParams.defaultData);
        self.viewas = ko.observable(self.params && self.params.viewas ? self.params.viewas : "tree");
        self.nodeData = ko.observableArray();
        self.structureDetailsLoaded = ko.observable(false);
        self.setDefaultInstructionsLoaded = ko.observable(false);
        self.structureDetails = ko.observable(rootParams.structureDetails.structureList()[0]);
        self.structureType = rootParams.structureDetails.structureList()[0].structureType();
        self.accountList = ko.observable(rootParams.accountList);
        self.mode = ko.observable("update");
        rootParams.baseModel.registerElement(["page-section"]);
        rootParams.baseModel.registerComponent("tree-view", "liquidity-management");
        rootParams.baseModel.registerComponent("set-instruction-details", "liquidity-management");
        rootParams.baseModel.registerComponent("view-structure-tabular", "liquidity-management");
        rootParams.baseModel.registerComponent("set-pool-instructions", "liquidity-management");

        self.isIEBrowser = ko.observable(false);

        /* Sample function that returns boolean in case the browser is Internet Explorer*/
        function isIE() {
            const ua = navigator.userAgent,
                is_ie = ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1;

            return is_ie;
        }

        /**
         * A recursive function called to fetch the specified node details.
         *
         * @memberOf view-structure
         * @function getNodeLinkDetails
         * @param {Object} startId Contains account of specified node.
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

        self.instructionStatusMap = {};

        self.linkClicked = function(id) {
            self.nodeData.removeAll();

            if (self.accountList() && self.accountList().children) {
                const startId = id.split("-")[0],
                    endId = id.split("-")[1],
                    nodeDetails = getNodeLinkDetails(startId, endId, self.accountList());

                if (nodeDetails() && nodeDetails()[1].account && nodeDetails()[1].account.cashCCMethod === "Sweep") {
                    rootParams.dashboard.openRightPanel("set-instruction-details", {
                        structureDetails: self.structureDetails(),
                        defaultInstructions: rootParams.defaultInstructionDetails,
                        nodeDetails: nodeDetails,
                        instructionStatusMap: self.instructionStatusMap
                    }, self.resources.structure.instructionDetails);
                } else if (nodeDetails() && nodeDetails()[1].account && nodeDetails()[1].account.cashCCMethod === "Pool" && ((nodeDetails()[1].account.level > 1 && self.structureDetails().structureKey.versionNo() === 1) || self.structureDetails().structureKey.versionNo() > 1)) {
                    rootParams.dashboard.openRightPanel("set-pool-instructions", {
                        structureDetails: self.structureDetails(),
                        nodeDetails: nodeDetails,
                        instructionStatusMap: self.instructionStatusMap,
                        isEditable: true
                    }, self.resources.structure.reallocationMethod);
                }
            }
        };

        /** This function will open the popup on switching to tree view.
         *
         * @memberof edit-structure-instruction
         * @function openPopup
         * @returns {void}
         */
        self.openPopup = function() {
            const popup = document.querySelector("#popup");

            popup.open("#instructionInfo");
        };

        /** This function will close the popup on either clicking cancel icon of popup or clicking anywhere.
         *
         * @memberof edit-structure-instruction
         * @function closePopup
         * @returns {void}
         */
        self.closePopup = function() {
            const popup = document.querySelector("#popup");

            popup.close();
        };

        /**
         * This function is used to set viewas to tree view.
         *
         * @memberOf edit-structure-instruction
         * @function setTreeView
         * @returns {void}
         */
        self.setTreeView = function() {
            self.openPopup();
            self.reset("tree");
        };

        /**
         * This function is used to set viewas to tabular view.
         *
         * @memberOf edit-structure-instruction
         * @function setTabularView
         * @returns {void}
         */
        self.setTabularView = function() {
            self.closePopup();
            self.reset("table");
        };

        /**
         * This function is used to refresh data based on selected icon on screen.
         *
         * @memberOf edit-structure-instruction
         * @function reset
         * @param {Object} data - To be passed to refresh.
         * @returns {void}
         */
        self.reset = function(data) {
            self.structureDetailsLoaded(false);
            self.viewas(data);
            self.structureDetailsLoaded(true);
        };

        self.next = function() {
            rootParams.stageChangeHandler("edit-structure-instructions", self.accountList(), "next");
        };

        self.afterRender = function() {
            setTimeout(function() {
                self.openPopup();
            }, 1);
        };

        if (isIE()) {
            self.reset("table");
            self.isIEBrowser(true);
        } else {
            self.isIEBrowser(false);
        }

        /**
         * This function will be used to go to previous component.
         *
         * @memberOf edit-structure-instruction
         * @function back
         * @returns {void}
         */
        self.back = function() {
            rootParams.stageChangeHandler("edit-structure-instructions", self.accountList(), "back");
        };
    };
});
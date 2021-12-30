/**
 * view-instruction-details contains all the methods to view a instruction.
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} * @requires {object} ResourceBundle
 */
define([
    "knockout",

    "ojL10n!resources/nls/view-instruction-details",
    "ojs/ojknockout"
], function(ko, ResourceBundle) {
    "use strict";

    /** View instruction detail.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     *
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.instructionDetails = ko.observable();
        self.resources = ResourceBundle;
        self.cashCCMethod = ko.observable();
        self.instructionDetailsLoaded = ko.observable(false);
        rootParams.baseModel.registerElement(["page-section"]);
        rootParams.baseModel.registerComponent("tree-view", "liquidity-management");
        self.treeJson = ko.observableArray();
        self.isIEBrowser = ko.observable(false);

        /**
         * This function is used to get instruction details.
         *
         * @memberOf view-instruction-details
         * @function  getInstructionDetails
         * @returns {void}
         */
        function getInstructionDetails() {
            self.structureDetails = ko.observable(self.structureDetails);

            const childArray = [];

            childArray.push(self.nodeDetails()[1]);

            self.treeJson({
                account: self.nodeDetails()[0],
                children: childArray
            });

            self.cashCCMethod(self.nodeDetails()[1].account.cashCCMethod);

            if (self.nodeDetails()[1].account.instructionList.instructiondetailList) {
                self.instructionDetails(self.nodeDetails()[1].account.instructionList.instructiondetailList[0].instructionParamLst);
            }

            self.instructionDetailsLoaded(true);
        }

        /* Sample function that returns boolean in case the browser is Internet Explorer*/
        function isIE() {
            const ua = navigator.userAgent,
                is_ie = ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1;

            return is_ie;
        }

        /* Create an alert to show if the browser is IE or not */
        if (isIE()) {
            self.isIEBrowser(true);
        } else {
            self.isIEBrowser(false);
        }

        getInstructionDetails();
    };
});
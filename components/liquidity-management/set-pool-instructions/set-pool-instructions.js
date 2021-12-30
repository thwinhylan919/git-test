/**
 * set-pool-instructions helps to set reallocation method for pool type
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} setPoolInstructionsModel
 * @requires {object} ResourceBundle
 */
define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/set-pool-instructions",
    "ojs/ojknockout"
], function(ko, setPoolInstructionsModel, ResourceBundle) {
    "use strict";

    /**
     * Set-pool-instructions component is used to set reallocation method for child accounts of structure.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resources = ResourceBundle;
        self.dataLoaded = ko.observable(false);
        self.structureDetails = ko.observable(ko.utils.unwrapObservable(self.structureDetails));
        self.versionNo = ko.utils.unwrapObservable(self.structureDetails().structureKey.versionNo);
        self.reallocationMethod = ko.observable(ko.utils.unwrapObservable(self.nodeDetails()[0].reallocationMethod) || ko.utils.unwrapObservable(self.structureDetails().reallocationMethod));
        self.reallocationMethodList = ko.observableArray();
        self.isIEBrowser = ko.observable(false);
        self.treeJson = ko.observableArray();

        const childArray = [];

        childArray.push(self.nodeDetails()[1]);

        self.treeJson({
            account: self.nodeDetails()[0],
            children: childArray
        });

        self.cashCCMethod = ko.observable(self.nodeDetails()[0].cashCCMethod);

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

        setPoolInstructionsModel.getReallocationMethod().then(function(reallocationMethodResponse) {
            if (reallocationMethodResponse && reallocationMethodResponse.enumRepresentations[0].data !== null && reallocationMethodResponse.enumRepresentations[0].data.length > 0) {
                for (let j = 0; j < reallocationMethodResponse.enumRepresentations[0].data.length; j++) {
                    self.reallocationMethodList.push({
                        text: reallocationMethodResponse.enumRepresentations[0].data[j].description,
                        value: reallocationMethodResponse.enumRepresentations[0].data[j].code
                    });
                }
            }

            self.dataLoaded(true);
        });

        /**
         * @function update
         * @memberof set-pool-instructions
         * @return {void}
         */
        self.update = function() {
            if (!self.instructionStatusMap[self.nodeDetails()[0].accountDetails.accountKey.accountNo.value + "~" + self.nodeDetails()[1].account.accountDetails.accountKey.accountNo.value]) {
                self.instructionStatusMap[self.nodeDetails()[0].accountDetails.accountKey.accountNo.value + "~" + self.nodeDetails()[1].account.accountDetails.accountKey.accountNo.value] = true;
            }

            self.nodeDetails()[0].reallocationMethod = self.reallocationMethod;
            rootParams.closeHandler();
        };
    };
});
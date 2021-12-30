/**
 * structure-account-mapping helps to add account for a particular structure for a particular id
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} * @requires {object} structureModel
 * @requires {object} ResourceBundle
 */
define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/notional-account-details",
    "ojs/ojknockout"
], function(ko, notionalDetailsModel, ResourceBundle) {
    "use strict";

    /** Structure Account mapping for a particular structure of the party.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(notionalDetailsModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.notionalAccountDetailsModel = getNewKoModel().notionalAccountDetailsModel;
        self.dataLoaded = ko.observable(false);
        self.selectedHeaderAccount = rootParams.rootModel.selectedHeaderAccount || null;
        self.branchCodeList = ko.observableArray();
        self.currencyList = ko.observableArray();

        let customerDesc;

        Promise.all([notionalDetailsModel.getBranches(), notionalDetailsModel.getCurrency(), notionalDetailsModel.getPartyDetails()]).then(function(responses) {
            responses[0].jsonNode.lmvwBranchDetailDtos.forEach(function(branch) {
                self.branchCodeList.push({
                    text: branch.branchId + "-" + branch.branchName,
                    value: branch.branchId
                });
            });

            responses[1].jsonNode.ccyListLov.forEach(function(currency) {
                self.currencyList.push({
                    text: currency.ccyCode,
                    value: currency.ccyCode
                });
            });

            customerDesc = responses[2].party.personalDetails.fullName;
            self.dataLoaded(true);
        });

        /**
         * This function will be used to add.
         *
         * @memberOf notional-account-details
         * @function add
         * @returns {void}
         */
        self.add = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("notionalDetailsTracker"))) {
                return;
            }

            const account = {
                accountDetails: {
                    accountKey: {
                        accountNo: {
                            value : "xxxxxxxxxxxxxxxx",
                            displayValue : "xxxxxxxxxxxxxxxx"
                        },
                        branchCode: self.notionalAccountDetailsModel.systemAccBranch,
                        ccyId: self.notionalAccountDetailsModel.systemAccCcy
                    },
                    accountDesc: self.resource.notionalAccount,
                    customerDesc: customerDesc
                }
            };

            self.structureDetails().structureList()[0].systemAccBranch = self.notionalAccountDetailsModel.systemAccBranch;
            self.structureDetails().structureList()[0].systemAccCcy = self.notionalAccountDetailsModel.systemAccCcy;
            self.selectedHeaderAccount(account);
            rootParams.closeHandler();
        };
    };
});

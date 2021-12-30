/**
 * Model for payee-view-edit
 *
 * @param {object} BaseService instance
 * @return {object} PayeeViewEditModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const PayeeViewEditModel = function() {
        /**
         * In case more than one instance of PayeeViewEditModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
                this.payeeLimitModel = {
                    currency: "",
                    accessPointValue: "",
                    accessPointGroupType: "",
                    targetLimitLinkages: [{
                        target: {
                            value: "",
                            type: {
                                id: "PAYEE",
                                name: "PAYEE",
                                mandatory: true
                            }
                        },
                        limits: [],
                        effectiveDate: "",
                        expiryDate: ""
                    }]
                };

                this.limitModel = {
                    limitType: "PER",
                    maxAmount: {
                        currency: null,
                        amount: null
                    },
                    maxCount: null,
                    periodicity: null
                };

                this.editPayeeModel = {
                    shared: false,
                    contentId: null
                };
            },
            baseService = BaseService.getInstance();

        return {
            /**
             * Returns new Model instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },
            postPayeeLimit: function(payload) {
                return baseService.add({
                    url: "me/customLimitPackage",
                    data: payload
                });
            },
            putPayeeLimit: function(payload) {
                return baseService.update({
                    url: "me/customLimitPackage",
                    data: payload
                });
            },
            fetchEffectiveTodayDetails: function() {
                return baseService.fetch({
                    url: "limitPackages/config/effectiveToday"
                });
            },
            assignedLimitPackages: function() {
                return baseService.fetch({
                    url: "me/assignedLimitPackage"
                });
            },
            fetchCourierAddress: function() {
                return baseService.fetch({
                    url: "me/party"
                });
            },
            fetchBranchAddress: function(branchCode) {
                return baseService.fetch({
                    url: "locations/branches?branchCode={branchCode}"
                }, {
                    branchCode: branchCode
                });
            }
        };
    };

    return new PayeeViewEditModel();
});
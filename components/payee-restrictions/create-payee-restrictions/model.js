/**
 * Model for create-payee-restrictions.
 * @param {object} BaseService base service instance for server communication
 * @return {object} payeeCountLimitModel Modal instance
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const payeeCountLimitModel = function payeeCountLimitModel() {
        const Model = function() {
                this.payeeRestrictionModel = {
                    payeeCountLimitList: []
                };

                this.payeeTypeData = {
                    payeeType: "",
                    accountPayee: [],
                    draftpayee: []
                };

                this.updateElement = {
                    payeeType: null,
                    payeesPerDay: null,
                    payeeCountLimitStatus: null,
                    entityDTO: {
                        value: null,
                        type: null
                    }
                };
            },
            baseService = BaseService.getInstance();

        return {
            /**
             * Method to get new modal instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },
            /**
             * FetchBankConfiguration - fetch the configuration details.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchBankConfiguration: function() {
                return baseService.fetch({
                    url: "bankConfiguration"
                });
            }
        };
    };

    return new payeeCountLimitModel();
});
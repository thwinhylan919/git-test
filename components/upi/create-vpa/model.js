/**
 * Model for create-vpa
 *
 * @param {object} BaseService instance
 * @return {object} createVpaModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const createVpaModel = function() {
        /**
         * In case more than one instance of createVpaModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
                this.createVpaModel = {
                    accountId: {
                        value: null,
                        displayValue: null
                    },
                    id: null
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
            /**
             * Checks availability of vpa.
             *
             * @param {Object} vpaId - Holds vpaId.
             * @returns {Promise}  Returns the promise object.
             */
            checkAvailability: function(vpaId) {
                return baseService.fetch({
                    url: "virtualPaymentAddresses/{vpaAddress}/validation"
                }, {
                    vpaAddress: vpaId
                });
            }
        };
    };

    return new createVpaModel();
});
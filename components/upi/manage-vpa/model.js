/**
 * Model for manage-vpa
 *
 * @param {object} BaseService instance
 * @return {object} manageVpaModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const manageVpaModel = function() {
        /**
         * In case more than one instance of manageVpaModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @private
         */
        const baseService = BaseService.getInstance();

        return {
            /**
             * Fetches list of vpa's.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchList: function() {
                return baseService.fetch({
                    url: "virtualPaymentAddresses"
                });
            },
            /**
             * Fetches list of accounts.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchAccountData: function() {
                return baseService.fetch({
                    url: "accounts/demandDeposit"
                });
            },
            /**
             * Deletes vpa.
             *
             * @param {Object} vpaId - Holds vpaId.
             * @returns {Promise}  Returns the promise object.
             */
            deleteVpa: function(vpaId) {
                return baseService.remove({
                    url: "virtualPaymentAddresses/{id}"
                },{
                    id: vpaId
                });
            }
        };
    };

    return new manageVpaModel();
});
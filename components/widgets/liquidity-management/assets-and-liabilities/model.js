/** Model for assets-and-liabilities
 * @param {object} BaseService base service instance for server communication
 * @param {object} constants constant instance for server communication
 * @return {object} currencyAssetModel
 */
define(["jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const currencyAssetModel = function() {

        /**
         * In case more than one instance of currencyAssetModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance(),
            /**
             * Method to fire batch.
             *
             * @param {Object} deferred - Deferred object.
             * @param {Object} batchRequest - Batch request instance.
             * @returns {Object}  Returns promise instance.
             */
            fireBatch = function(deferred, batchRequest) {
                const options = {
                    url: "batch",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

                baseService.batch(options, {}, batchRequest);
            };

        return {
            /**
             * Method to get account details.
             *
             * @returns {Object}  Returns the modelData.
             */
            fetchAccounts: function() {
                return baseService.fetchWidget({
                    url: "liquidityManagement/accounts?notionalAccFlag=N",
                    mockedUrl:"framework/json/design-dashboard/liquidity-management/lm-accounts.json",
                    apiType: "extended"
                });
            },
            /**
             * Method to fetch bank configurations.
             *
             * @returns {Object}  Returns the promise of response.
             */
            fetchBankConfig: function() {
                return baseService.fetch({
                    url: "bankConfiguration"
                });
            },

            /**
             * Method to fire abtch request.
             *
             * @param {Object} batchRequest - Party id of the logged in user.
             * @returns {void}
             */
            fireBatch: function(batchRequest) {
                const fireBatchDeferred = $.Deferred();

                fireBatch(fireBatchDeferred, batchRequest);

                return fireBatchDeferred;
            },
            /**
             * Method to get currency list.
             *
             * @returns {Object}  Returns the modelData.
             */
            fetchCurrencyList: function() {
                return baseService.fetchWidget({
                    url: "liquidityManagement/enumerations/currency",
                    mockedUrl:"framework/json/design-dashboard/liquidity-management/currency-list.json",
                    apiType: "extended"
                });
            }
        };
    };

    return new currencyAssetModel();
});
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    /**
     * Main file for BaseConfiguration Model. This file contains the model definition
     * for list of properties fetched from the server from table digx_fw_config_all_b through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *              <li>[init()]{@link MutualFundsModel.init}</li>.
     *
     *              <li>[getProperty()]{@link MutualFundsModel.getStaticResponse}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~MutualFundsModel
     * @class MutualFundsModel
     */
    const MutualFundsModel = function() {
        const baseService = BaseService.getInstance();
        let getRiskProfileTypesDeferred;
        /**
         * Private method to fetch the User for Feedback like corporate, retail . This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getRiskProfileTypes
         * @memberOf MutualFundsModel
         * @param {Object} deferred - An object type Deferred.
         * @returns {void}
         */
        const getRiskProfileTypes = function(deferred) {
            const options = {
                url: "riskProfileCategories",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let confirmRiskProfileDeferred;
        /**
         * Private method to fetch the User for Feedback like corporate, retail . This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function confirmRiskProfile
         * @memberOf MutualFundsModel
         * @param {Object} deferred - An object type Deferred.
         * @param {Object} investmentAccountId - A investmentAccountId for account to update.
         * @param {string} payload - A object of type payload.
         * @returns {void}
         */
        const confirmRiskProfile = function(deferred, investmentAccountId, payload) {
            const options = {
                    url: "accounts/investmentAccounts/{investmentAccountId}/riskProfile",
                    data: payload,
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deferred.reject(data, status, jqXhr);
                    }
                },

 params = {
                    investmentAccountId: investmentAccountId
                };

            baseService.add(options, params);
        };

        return {
            getRiskProfileTypes: function() {
                getRiskProfileTypesDeferred = $.Deferred();
                getRiskProfileTypes(getRiskProfileTypesDeferred);

                return getRiskProfileTypesDeferred;
            },
            confirmRiskProfile: function(investmentAccountId, payload) {
                confirmRiskProfileDeferred = $.Deferred();
                confirmRiskProfile(confirmRiskProfileDeferred, investmentAccountId, payload);

                return confirmRiskProfileDeferred;
            }
        };
    };

    return new MutualFundsModel();
});

/** Model for position-wise-currency
 * @param {object} BaseService base service instance for server communication
 * @return {object} currencyPositionMappingModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const currencyPositionMappingModel = function() {

        /**
         * In case more than one instance of currencyPositionMappingModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();

        return {
            /**
             * Method to get account details.
             *
             * @returns {Object}  Returns the modelData.
             */
            fetchAccount: function() {
                return baseService.fetchWidget({
                    url: "liquidityManagement/accounts?notionalAccFlag=N",
                    mockedUrl:"framework/json/design-dashboard/liquidity-management/lm-accounts.json",
                    apiType: "extended"
                });
            }
        };
    };

    return new currencyPositionMappingModel();
});
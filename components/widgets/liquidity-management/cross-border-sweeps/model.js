/** Model for cross-border-sweeps
 * @param {object} BaseService base service instance for server communication
 * @return {object} crossBorderSweepCurrencyMappingModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const crossBorderSweepCurrencyMappingModel = function() {

        /**
         * In case more than one instance of crossBorderSweepCurrencyMappingModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();

        return {
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
             * Method to get cross currency sweep details based on selected currency type.
             *
             * @param {Object} queryParams - Query params to be sent.
             * @returns {Object}  Returns the modelData.
             */
            fetchCrossBorderCurrency: function(queryParams) {
                return baseService.fetchWidget({
                    url: "liquidityManagement/sweepLogs?filter=S&crossCCY=true&domestic=false&toAccCcy={toAccCcy}&toDate={toDate}&fromDate={fromDate}",
                    mockedUrl:"framework/json/design-dashboard/liquidity-management/cross-border-currency.json",
                    apiType: "extended"
                },{
                    toAccCcy:queryParams.toAccCcy,
                    toDate:queryParams.toDate,
                    fromDate:queryParams.fromDate
                });
            }
        };
    };

    return new crossBorderSweepCurrencyMappingModel();
});
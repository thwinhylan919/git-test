/** Model for top-five-sweeps
 * @param {object} BaseService base service instance for server communication
 * @return {object} topFiveSweepsModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const topFiveSweepsModel = function() {

        /**
         * In case more than one instance of topFiveSweepsModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
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
             * Method to get sweep currency details based on selected currency type.
             *
             * @param {Object} queryParams - Query params to be passed to the request.
             * @returns {Object}  Returns the modelData.
             */
            fetchCurrency: function(queryParams) {
                return baseService.fetchWidget({
                    url: "liquidityManagement/sweepLogs?filter=S&crossCCY=false&toAccCcy={toAccCcy}&toDate={toDate}&fromDate={fromDate}",
                    mockedUrl:"framework/json/design-dashboard/liquidity-management/top-five-sweeps.json",
                    apiType: "extended"
                },
                {
                  toAccCcy:queryParams.toAccCcy,
                  toDate:queryParams.toDate,
                  fromDate:queryParams.fromDate
                });
            }
        };
    };

    return new topFiveSweepsModel();
});
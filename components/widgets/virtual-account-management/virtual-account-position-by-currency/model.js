define([
    "baseService"
], function (BaseService) {
    "use strict";

    /**
     * Main file for virtual account cash position by currency Model. This file contains the model definition
     * for list of properties fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *              <li>[init()]{@link VirtualCashPositionByCurrency.init}</li>.
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~VirtualCashPositionByCurrency
     * @class VirtualCashPositionByCurrency
     */
    const VirtualCashPositionByCurrency = function () {
        /* variable to make sure that in case there is no change
         * in model no additional fetch requests are fired.*/
        const baseService = BaseService.getInstance(),
            /**
             * Private method to list virtual entities
             *
             * @function fetchVirtualEntities
             * @memberOf EntitySummaryModel
             * @param {string} q - The generic filtering parameter.
             * @param {string} sortParam - Sorting parameter to sort query param results.
             * @param {string} count - Parameter to restrict count of query param results.
             * @returns {void}
             * @private
             */
            fetchVirtualEntities = function (q, sortParam, count) {
                return baseService.fetchWidget({
                    url: "virtualEntities?query={q}&sortBy={sortParam}&maxRecords={count}"
                }, {
                    q: q,
                    sortParam: sortParam,
                    count: count
                });
            },
            /**
             * Private method to fetch the list of virtual account based on search. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function fetchCurrencySummary
             * @memberOf VirtualCashPositionByCurrency
             * @param {string} q - The generic filtering parameter.
             * @param {string} data - The field on which aggregation is to be done
             * @returns {void}
             * @private
             */
            fetchCurrencySummary = function (q, data) {
                const options = {
                        url: "aggregator/resource/virtualAccounts?q={q}&data={data}",
                        mockedUrl: "framework/json/design-dashboard/virtual-account-management/virtual-account-summary.json"
                    },
                    params = {
                        q: q,
                        data: data
                    };

                return baseService.fetchWidget(options, params);
            };

        return {
            fetchVirtualEntities: fetchVirtualEntities,
            fetchCurrencySummary: fetchCurrencySummary
        };
    };

    return new VirtualCashPositionByCurrency();
});
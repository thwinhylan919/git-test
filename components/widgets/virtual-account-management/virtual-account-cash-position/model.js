define([
    "baseService"
], function (BaseService) {
    "use strict";

    /**
     * Main file for virtual entity management Model. This file contains the model definition
     * for list of properties fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *              <li>[init()]{@link CashPositionModel.init}</li>.
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~CashPositionModel
     * @class CashPositionModel
     */
    const CashPositionModel = function () {
        const baseService = BaseService.getInstance(),
            /**
             * Private method to fetch the list of virtual account based on search. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function fetchVirtualAccountListSummary
             * @memberOf CashPositionModel
             * @param {string} query - Query Parameters.
             * @param {string} count - Maximum number of records to be fetched.
             * @returns {void}
             * @private
             */
            fetchVirtualAccountListSummary = function (query, count) {
                const options = {
                        url: "accounts/virtual?q={query}&count={count}",
                        mockedUrl: "framework/json/design-dashboard/virtual-account-management/virtual-account-summary.json"
                    },
                    params = {
                        query: query,
                        count: count
                    };

                return baseService.fetchWidget(options, params);
            },
            /**
             * Private method to add the new property for the given virtual entity details. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function fetchCurrency
             * @memberOf CashPositionModel
             * @param {string} limit - Additional param.
             * @param {string} offset - Additional param.
             * @returns {void}
             * @private
             */
            fetchCurrency = function (limit, offset) {
                const options = {
                        url: "currencies?limit={limit}&offset={offset}",
                        mockedUrl: "framework/json/design-dashboard/virtual-account-management/virtual-entity-summary/virtual-entities-summary.json",
                        apiType: "extended"
                    },
                    params = {
                        limit: limit,
                        offset: offset
                    };

                return baseService.fetchWidget(options, params);
            },
            /**
             * Private method to add the new property for the given virtual entity details. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function getEntityListSummary
             * @memberOf CashPositionModel
             * @param {string} q - The generic filtering parameter.
             * @param {string} sortParam - Sorting parameter to sort query param results.
             * @param {string} count - Parameter to restrict count of query param results.
             * @returns {void}
             * @private
             */
            getEntityListSummary = function (q, sortParam, count) {
                return baseService.fetchWidget({
                    url: "virtualEntities?query={q}&sortBy={sortParam}&maxRecords={count}"
                }, {
                    q: q,
                    sortParam: sortParam,
                    count: count
                });
            },
            /**
             * Private method to fetch data for maintenance. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function maintenances
             * @memberOf CashPositionModel
             * @returns {void}
             * @private
             */
            maintenances = function () {
                const options = {
                    url: "maintenances/virtualAccounts",
                    mockedUrl: "framework/json/design-dashboard/virtual-account-management/virtual-account-cash-position/maintenances.json"
                };

                return baseService.fetchWidget(options);
            };

        return {
            fetchVirtualAccountListSummary: fetchVirtualAccountListSummary,
            fetchCurrency: function (limit, offset) {
                return fetchCurrency(limit, offset);
            },
            getEntityListSummary: getEntityListSummary,
            maintenances: maintenances
        };
    };

    return new CashPositionModel();
});
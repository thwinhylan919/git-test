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
             * Private method to fetch the list of transactions based on search. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function fetchTransactionList
             * @memberOf CashPositionModel
             * @param {string} virtualAccount - A real customer number.
             * @param {string} q - The generic filtering parameter.
             * @returns {void}
             * @private
             */
            fetchTransactionList = function (virtualAccount, q) {
                const options = {
                        url: "accounts/virtual/{virtualAccount}/statements?q={q}"
                    },
                    params = {
                        virtualAccount: virtualAccount,
                        q: q
                    };

                return baseService.fetch(options, params);
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
            fetchTransactionList: fetchTransactionList,
            maintenances: maintenances
        };
    };

    return new CashPositionModel();
});
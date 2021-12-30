define(["baseService"], function (BaseService) {
  "use strict";

  /**
   * Main file for Virtual Account Balances Model. This file contains the model definition
   * for list of virtual account fetched from the host through the pass through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of virtual account summary:
   *          <ul>
   *              <li>[init()]{@link VirtualAccountBalanceModel.init}</li>.
   *
   *              <li>[getProperty()]{@link VirtualAccountBalanceModel.fetchVirtualAccountSummaryList}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualAccountBalanceModel
   * @class VirtualAccountBalanceModel
   */
  const VirtualAccountBalanceModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to add the new property for the given virtual entity details. This
       * method will resolve a promise, which can be returned
       * from calling function to the parent.
       *
       * @function fetchEntityListSummary
       * @memberOf VirtualAccountBalanceModel
       * @param {string} q - The generic filtering parameter.
       * @param {string} sortParam - Sorting parameter to sort query param results.
       * @param {string} count - Parameter to restrict count of query param results.
       * @returns {void}
       * @private
       */
      fetchEntityListSummary = function (q, sortParam, count) {
        return baseService.fetchWidget({
          url: "virtualEntities?query={q}&sortBy={sortParam}&maxRecords={count}"
        }, {
          q: q,
          sortParam: sortParam,
          count: count
        });
      },
      /**
       * Private method to fetch the list of remittance based on search. This
       * method will resolve a promise, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVirtualAccountSummaryList
       * @memberOf VirtualAccountBalanceModel
       * @param {string} query - Query Parameters.
       * @param {string} sortBy - The sorting parameter to sort q param results
       * @param {string} count - Maximum number of records to be fetched.
       * @returns {void}
       * @private
       */

      fetchVirtualAccountSummaryList = function (query, sortBy, count) {
        return baseService.fetchWidget({
          url: "accounts/virtual?q={query}&sortBy={sortBy}&count={count}"
        }, {
          query: query,
          sortBy: sortBy,
          count: count
        });
      },
      /**
       * Private method to fetch the currencies. This
       * method will resolve a promise, which can be returned
       * from calling function to the parent.
       *
       * @function fetchCurrencies
       * @memberOf VirtualAccountBalanceModel
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @returns  {void}
       * @private
       */
      fetchCurrencies = function (limit, offset) {
        return baseService.fetchWidget({
          url: "currencies?limit={limit}&offset={offset}",
          apiType: "extended"
        }, {
          limit: limit,
          offset: offset
        });
      };

    return {
      fetchVirtualAccountSummaryList: fetchVirtualAccountSummaryList,
      fetchCurrencies: fetchCurrencies,
      fetchEntityListSummary: fetchEntityListSummary
    };
  };

  return new VirtualAccountBalanceModel();
});
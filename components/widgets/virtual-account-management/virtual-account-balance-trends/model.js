define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for Virtual Account Balances Model. This file contains the model definition
   * for list of virtual account fetched from the host through the pass through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of virtual account summary:
   *          <ul>
   *              <li>[init()]{@link VirtualAccountBalanceTrendsModel.init}</li>.
   *
   *              <li>[getProperty()]{@link VirtualAccountBalanceTrendsModel.fetchCurrency}</li>
   *              <li>[getProperty()]{@link VirtualAccountBalanceTrendsModel.fetchVirtualEntities}</li>
   *              <li>[getProperty()]{@link VirtualAccountBalanceTrendsModel.fetchValueDatedBalances}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualAccountBalanceTrendsModel
   * @class VirtualAccountBalanceTrendsModel
   */
  const VirtualAccountBalanceTrendsModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to list virtual entities
       *
       * @function fetchCurrency
       * @memberOf VirtualAccountBalanceTrendsModel
       * @param {string} limit - The limit parameter
       * @param {string} ofsset - The offset parameter
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
       * Private method to list virtual entities
       *
       * @function fetchVirtualEntities
       * @memberOf VirtualAccountBalanceTrendsModel
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
       * Private method to list virtual entities
       *
       * @function fetchValueDatedBalances
       * @memberOf VirtualAccountBalanceTrendsModel
       * @param {string} q - The generic filtering parameter.
       * @param {string} sortBy - Sorting parameter to sort query param results.
       * @param {string} maxRecords - Parameter to restrict count of query param results.
       * @param {string} data - Parameter for aggregator rest call.
       * @returns {void}
       * @private
       */
      fetchValueDatedBalances = function (q, sortBy, maxRecords, data) {
        return baseService.fetchWidget({
          url: "aggregator/resource/virtualAccounts?q={q}&sortBy={sortBy}&maxRecords={maxRecords}&data={data}"
        }, {
          q: q,
          sortBy: sortBy,
          maxRecords: maxRecords,
          data: data
        });
      };

    return {

      fetchCurrency: fetchCurrency,
      fetchVirtualEntities: fetchVirtualEntities,
      fetchValueDatedBalances: fetchValueDatedBalances
    };
  };

  return new VirtualAccountBalanceTrendsModel();
});
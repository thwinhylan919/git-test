define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for Virtual Account Model. This file contains the model definition
   * for list of scales fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link VirtualAccountModel.init}</li>.
   *
   *              <li>[getProperty()]{@link VirtualAccountModel.fetchVirtualAccount}</li>
   *
   *              <li>[getProperty()]{@link VirtualAccountModel.fetchVirtualAccountListSummary}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualAccountModel
   * @class VirtualAccountModel
   */
  const VirtualAccountModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the virtual account.
       *
       * @function fetchVirtualAccount
       * @memberOf CreateStructureModel
       * @param {string} virtualAccountNo - virtual account number
       * @returns {void}
       * @private
       */
      fetchVirtualAccount = function (virtualAccountNo) {
        return baseService.fetch({
          url: "accounts/virtual/{virtualAccountNo}"
        }, {
            virtualAccountNo: virtualAccountNo
          });
      },
      /**
       * Private method to fetch the list of country.
       *
       * @function fetchVirtualAccountListSummary
       * @memberOf VirtualAccountModel
       * @param {string} query - Query Parameters.
       * @param {string} count - Maximum number of records to be fetched.
       * @returns {void}
       * @private
       */
      fetchVirtualAccountListSummary = function (query, count) {
        return baseService.fetch({
          url: "accounts/virtual?q={query}&count={count}"
        }, {
            query: query,
            count: count
          });
      };

    return {
      fetchVirtualAccount: function (virtualAccountNo) {
        return fetchVirtualAccount(virtualAccountNo);
      },
      fetchVirtualAccountListSummary: function (query, count) {
        return fetchVirtualAccountListSummary(query, count);
      }
    };
  };

  return new VirtualAccountModel();
});

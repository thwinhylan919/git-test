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
   *              <li>[init()]{@link AccountBalanceModel.init}</li>.
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~AccountBalanceModel
   * @class AccountBalanceModel
   */
  const AccountBalanceModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of virtual account based on search. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVirtualAccountListSummary
       * @memberOf AccountBalanceModel
       * @param {string} realCustomerNo - Real customer number.
       * @param {string} realAccountNo - Real account number.
       * @param {string} limit - limit
       * @param {string} offset - offset
       * @param {string} status - status
       * @param {string} realAcclinkage - real Account Linkage
       * @returns {void}
       * @private
       */
      fetchVirtualAccountListSummary = function (query) {
        const options = {
            url: "accounts/virtual?q={query}",
            mockedUrl: "framework/json/design-dashboard/virtual-account-management/account-balances/virtual-account-summary.json"
          },
          params = {
            query : query
          };

        return baseService.fetchWidget(options, params);
      },
      /**
       * Private method to fetch the list of virtual structures based on search. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVirtualStructureList
       * @memberOf AccountBalanceModel
       * @param {string} realCustomerNo - Real customer number.
       * @param {string} realAccountNo - Real account number.
       * @param {string} accountGroupId - Virtual Multi-Currency Account group id
       * @param {string} limit - limit
       * @param {string} offset - offset
       * @param {string} status - status
       * @returns {void}
       * @private
       */
      fetchVirtualStructureList = function (query) {
        const options = {
            url: "virtualAccountStructures?q={query}",
            mockedUrl: "framework/json/design-dashboard/virtual-account-management/account-balances/virtual-account-structure.json"
          },
          params = {
            query: query
          };

        return baseService.fetchWidget(options, params);
      },
      /**
       * Private method to fetch the list of VA Enabled Real Accounts. This
       * method will resolve a passed promise, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVAEnabledRealAccount
       * @memberOf AccountBalanceModel
       * @private
       */
      fetchVAEnabledRealAccount = function () {
        const options = {
            url: "accounts/vamAccounts"
          };

        return baseService.fetchWidget(options);
      },
      /**
       * Private method to fetch the list of all valid virtual multi-currency account groups.
       *
       * @function fetchVirtualMultiCurrencyAccounts
       * @memberOf AccountBalanceModel
       * @param {string} realCustomerNo - Real customer number.
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @returns {void}
       * @private
       */
      fetchVirtualMultiCurrencyAccounts = function (query) {
        const options = {
            url: "multiCurrencyAccounts?q={query}"
          },
          params = {
            query: query
          };

        return baseService.fetchWidget(options, params);
      };

    return {
      fetchVirtualAccountListSummary: function (query) {
        return fetchVirtualAccountListSummary(query);

      },
      fetchVirtualStructureList: function (query) {
        return fetchVirtualStructureList(query);
      },
      fetchVAEnabledRealAccount: function () {
        return fetchVAEnabledRealAccount();
      },
      fetchVirtualMultiCurrencyAccounts: function (query) {
        return fetchVirtualMultiCurrencyAccounts(query);
      }
    };
  };

  return new AccountBalanceModel();
});
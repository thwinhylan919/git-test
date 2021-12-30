define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for virtual account management Model. This file contains the model definition
   * for list of properties fetched from the host through the pass through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link VirtualMultiCurrencyAccountModel.init}</li>.
   *
   *              <li>[getProperty()]{@link VirtualMultiCurrencyAccountModel.fetchVirtualMultiCurrencyAccounts}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualMultiCurrencyAccountModel
   * @class VirtualMultiCurrencyAccountModel
   */
  const VirtualMultiCurrencyAccountModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of all valid virtual multi-currency account groups.
       *
       * @function fetchVirtualMultiCurrencyAccounts
       * @memberOf VirtualMultiCurrencyAccountModel
       * @returns {void}
       * @private
       */
      fetchVirtualMultiCurrencyAccounts = function () {
        const options = {
          url: "multiCurrencyAccounts"
        };

        return baseService.fetch(options);
      };

    return {
      fetchVirtualMultiCurrencyAccounts: fetchVirtualMultiCurrencyAccounts
    };

  };

  return new VirtualMultiCurrencyAccountModel();
});
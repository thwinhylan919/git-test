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
   *              <li>[getProperty()]{@link VirtualMultiCurrencyAccountModel.deleteMultiCcyAccount}</li>
   *
   *              <li>[getProperty()]{@link VirtualMultiCurrencyAccountModel.fetchDemandDeposits}</li>
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
       * Private method to delete virtual multi-currency account groups by id.
       *
       * @function deleteMultiCcyAccount
       * @memberOf VirtualMultiCurrencyAccountModel
       * @param {string} payload - Real Customer Number.
       * @param {string} realCustomerNo - Real Customer Number.
       * @param {string} virtualMCA - Virtual Multi-currency Account Number.
       * @private
       */
      deleteMultiCcyAccount = function (virtualMCA) {
        return baseService.remove({
          url: "multiCurrencyAccounts/{virtualMCA}"
        }, {
          virtualMCA: virtualMCA
        });
      },
      /**
       * Private method to fetch all the VAM enabled accounts for a given customer. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVAEnabledRealAccount
       * @memberOf VirtualMultiCurrencyAccountModel
       * @private
       */
      fetchVAEnabledRealAccount = function () {
        return baseService.fetch({
          url: "accounts/vamAccounts"
        });
      },
      /**
       * Private method to update the existing virtual multi-currency account. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @memberOf VirtualMultiCurrencyAccountModel
       * @param {String} id - Virtual Multi Currency Account Id for the multi-currency grounp to be read
       * @returns {void}
       * @private
       */
      readVirtualMultiCurrencyAccount = function (id) {
        const option = {
          url: "multiCurrencyAccounts/{id}"
        },
          params = {
            id: id
          };

        return baseService.fetch(option, params);
      };

    return {
      deleteMultiCcyAccount: deleteMultiCcyAccount,
      fetchVAEnabledRealAccount: fetchVAEnabledRealAccount,
      readVirtualMultiCurrencyAccount: readVirtualMultiCurrencyAccount
    };
  };

  return new VirtualMultiCurrencyAccountModel();
});
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
   *              <li>[getProperty()]{@link VirtualAccountModel.getEntityList}</li>
   *              <li>[getProperty()]{@link VirtualAccountModel.getBranchCode}</li>
   *              <li>[getProperty()]{@link VirtualAccountModel.fetchCountryList}</li>
   *              <li>[getProperty()]{@link VirtualAccountModel.fetchCurrencyList}</li>
   *              <li>[getProperty()]{@link VirtualAccountModel.fetchProductList}</li>
   *              <li>[getProperty()]{@link VirtualAccountModel.fetchVAMEnabledAccounts}</li>
   *              <li>[getProperty()]{@link VirtualAccountModel.createVirtualAccount}</li>
   *              <li>[getProperty()]{@link VirtualAccountModel.updateVirtualAccount}</li>
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
       * Private method to fetch the list of entity based on search.
       *
       * @function getEntityList
       * @memberOf VirtualAccountModel
       * @returns {void}
       * @private
       */
      getEntityList = function (q) {
        return baseService.fetch({
          url: "virtualEntities?query={q}"
        }, {
          q: q
        });
      },
      /**
       * Private method to fetch the list of branch code.
       *
       * @function getBranchCode
       * @memberOf VirtualAccountModel
       * @returns {void}
       * @private
       */
      getBranchCode = function (limit, offset) {
        return baseService.fetch({
          url: "virtualAccounts/branches",
          apiType: "extended"
        }, {
          limit: limit,
          offset: offset
        });
      },
      /**
       * Private method to fetch the list of country.
       *
       * @function fetchCountryList
       * @memberOf VirtualAccountModel
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @returns {void}
       * @private
       */
      fetchCountryList = function (limit, offset) {
        return baseService.fetch({
          url: "countries?limit={limit}&offset={offset}",
          apiType: "extended"
        }, {
          limit: limit,
          offset: offset
        });
      },
      /**
       * Private method to fetch the list of currency.
       *
       * @function fetchCurrencyList
       * @memberOf VirtualAccountModel
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @returns {void}
       * @private
       */
      fetchCurrencyList = function (limit, offset) {
        return baseService.fetch({
          url: "currencies?limit={limit}&offset={offset}",
          apiType: "extended"
        }, {
          limit: limit,
          offset: offset
        });
      },
      /**
       * Private method to fetch the products.
       *
       * @function fetchProductList
       * @memberOf VirtualAccountModel
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @returns {void}
       * @private
       */
      fetchProductList = function (realCustomerNo, limit, offset) {
        return baseService.fetch({
          url: "virtualAccounts/products?realCustomerNo={realCustomerNo}&limit={limit}&offset={offset}",
          apiType: "extended"
        }, {
          realCustomerNo: realCustomerNo,
          limit: limit,
          offset: offset
        });
      },
      /**
       * Private method to fetch the fetch VAM enabled accounts
       *
       * @function fetchVAMEnabledAccounts
       * @memberOf VirtualAccountModel
       * @param {string} realCustomerNo - A real customer number.
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @returns {void}
       * @private
       */
      fetchVAMEnabledAccounts = function (taskCode) {
        return baseService.fetch({
          url: "accounts/vamAccounts?taskCode={taskCode}"
        }, {
          taskCode: taskCode
        });
      },
      /**
       * Private method to add the new property for the given virtual account details.
       *
       * @function createVirtualAccount
       * @memberOf VirtualAccountModel
       * @param {Object} vAccCreateDto - Data to create a virtual account.
       * @returns {void}
       * @private
       */
      createVirtualAccount = function (vAccCreateDto) {
        return baseService.add({
          url: "accounts/virtual",
          data: vAccCreateDto
        });
      },
      /**
       * Private method to update the new property for the given virtual account details.
       *
       * @function updateVirtualAccount
       * @memberOf VirtualAccountModel
       * @param {Object} vAccUpdateDto - Data to update a virtual account.
       * @param {string} virtualAccountNo - VirtualAccountNo to update virtual account.
       * @returns {void}
       * @private
       */
      updateVirtualAccount = function (vAccUpdateDto, virtualAccountNo) {
        return baseService.update({
          url: "accounts/virtual/{virtualAccountNo}",
          data: vAccUpdateDto
        }, {
          virtualAccountNo: virtualAccountNo
        });
      },
      /**
       * Private method to update the new property for the given virtual account details.
       *
       * @function getEntityView
       * @memberOf VirtualAccountModel
       * @param {Object} virtualEntityId - Entity Id to be passed for virtual entity view.
       * @returns {void}
       * @private
       */
      getEntityView = function (virtualEntityId) {
        return baseService.fetch({
          url: "virtualEntities/{virtualEntityId}"
        }, {
          virtualEntityId: virtualEntityId
        });
      },
      /**
       * Private method to fetch the virtual account.
       *
       * @function fetchVirtualAccount
       * @memberOf VirtualAccountModel
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
      modelPayload = function () {
        return {
          partyId: null,
          virtualEntityId: null,
          virtualEntityName: null,
          virtualAccProduct: null,
          currencyCode: null,
          address: {
            zipCode: null,
            line1: null,
            line2: null,
            country: null,
            city: "city"
          },
          realAccountBrn: null,
          realAccountCcy: null,
          virtualAccountName: null,
          realAccountNo: null,
          ibanRequired: false,
          branchCode: null,
          id: {
            value: null,
            displayValue: null
          },
          balChkForDebits: false,
          debitTxnsAllowed: false,
          creditTxnsAllowed: false,
          defaultAccCcy: null,
          accountPurpose: null,
          overdraftAllowed: false,
          odFixedAmount: {
            currency: null,
            amount: null
          },
          realAccLinkage: null,
          interestCalcReq: false,
          ibanAccNo: null,
          balAvailabilityOptions: null,
          fixedAmtFromPool: {
            currency: null,
            amount: null
          },
          openingDate: null,
          frozen: false,
          accountStatus: null
        };
      };

    return {
      getEntityList: getEntityList,
      getEntityView: getEntityView,
      getBranchCode: getBranchCode,
      fetchCountryList: fetchCountryList,
      fetchCurrencyList: fetchCurrencyList,
      fetchProductList: fetchProductList,
      fetchVAMEnabledAccounts: fetchVAMEnabledAccounts,
      createVirtualAccount: createVirtualAccount,
      updateVirtualAccount: updateVirtualAccount,
      fetchVirtualAccount: fetchVirtualAccount,
      modelPayload: modelPayload
    };
  };

  return new VirtualAccountModel();
});
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
   *              <li>[init()]{@link MoveMoneyModel.init}</li>.
   *
   *              <li>[getProperty()]{@link MoveMoneyModel.fetchVirtualAccountList}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~MoveMoneyModel
   * @class MoveMoneyModel
   */
  const MoveMoneyModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of virtual account based on search. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVirtualAccountList
       * @memberOf MoveMoneyModel
       * @param {string} realAccountNo - Real account number.
       * @param {string} realAccountBranch - Real Account Branch Code.
       * @returns {void}
       * @private
       */
      fetchVirtualAccountList = function (query, taskCode) {
        const options = {
           url: "accounts/virtual?q={query}&taskCode={taskCode}&indirectLinkage=true"
        },
          params = {
            query: query,
            taskCode: taskCode
          };

        return baseService.fetch(options, params);
      },
      /**
       * Private method to fetch virtual account balance based on search. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVirtualAccountBalance
       * @memberOf MoveMoneyModel
       * @param {string} virtualAccountNo -  Virtual account number.
       * @param {string} virtualAccountCcy -  Virtual account currency.
       * @returns {void}
       * @private
       */
      fetchVirtualAccountBalance = function (virtualAccountNo, virtualAccountCcy) {
        const options = {
          url: "accounts/virtual/{virtualAccountNo}/balances;currency={virtualAccountCcy}"
        },
          params = {
            virtualAccountNo: virtualAccountNo,
            virtualAccountCcy: virtualAccountCcy
          };

        return baseService.fetch(options, params);
      },
      /**
      * Private method to fetch access points for the limits
      *
      * @function fetchAccessPoints
      * @memberOf VirtualAccountModel
      * @returns {void}
      * @private
      */
     fetchAccessPoints = function () {
      return baseService.fetch({
        url: "accessPoints"
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
       * Private method to create the multi-currency payload. This
       * method will resolve a payload, which can be returned
       * from calling function to the parent.
       *
       * @function multiCurrencyPayload
       * @memberOf MultiCurrencyModel
       * @private
       */
      moveMoneyPayload = function () {
        return {
          intbks: {
            branchCode: "",
            realAccountNo: {
              value: "",
              displayValue: ""
            },
            debitAccountId: "",
            creditAccountId: "",
            debitAmount: {
              currency: "",
              amount: ""
            },
            creditAmount: {
              currency: "",
              amount: ""
            },
            valueDate: "",
            transactionType: "D"
          }
        };
      },
      /**
       * Private method to fetch data for maintenance. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function maintenances
       * @memberOf MoveMoneyModel
       * @returns {void}
       * @private
       */
      maintenance = function () {
        const options = {
          url: "maintenances/virtualAccounts"
        };

        return baseService.fetch(options);
      };

    return {
      fetchVirtualAccountList: function (query, taskCode) {
        return fetchVirtualAccountList(query, taskCode);
      },
      fetchVirtualAccountBalance: function (virtualAccountNo, virtualAccountCcy) {
        return fetchVirtualAccountBalance(virtualAccountNo, virtualAccountCcy);

      },
      maintenance: function () {
        return maintenance();
      },
      getNewModel: function() {
        return moveMoneyPayload();
      },
      fetchAccessPoints: function() {
        return fetchAccessPoints();
      },
      fetchVAMEnabledAccounts: function(taskCode) {
        return fetchVAMEnabledAccounts(taskCode);
      }
    };
  };

  return new MoveMoneyModel();
});
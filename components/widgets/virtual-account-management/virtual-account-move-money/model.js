define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for virtaul account management Model. This file contains the model definition
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
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @param {string} recordStat - Record status.
       * @returns {void}
       * @private
       */
      fetchVirtualAccountList = function (query,taskCode) {
        const options = {
          url: "accounts/virtual?q={query}&taskCode={taskCode}&indirectLinkage=true"
       },
         params = {
           query: query,
           taskCode: taskCode
         };

        return baseService.fetchWidget(options, params);
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
        return baseService.fetchWidget({
          url: "accounts/vamAccounts?taskCode={taskCode}"
        }, {
            taskCode: taskCode
          });
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
          url: "accounts/virtual/{virtualAccountNo}/balances;currency={virtualAccountCcy}",
          mockedUrl: "framework/json/design-dashboard/virtual-account-management/move-money/balances.json"
        },
          params = {
            virtualAccountNo: virtualAccountNo,
            virtualAccountCcy: virtualAccountCcy
          };

        return baseService.fetchWidget(options, params);
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
            transactionType : "D"
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
          url: "maintenances/virtualAccounts",
          mockedUrl: "framework/json/design-dashboard/virtual-account-management/move-money/maintenances.json"
        };

        return baseService.fetchWidget(options);
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
    };

    return {
      fetchVirtualAccountList: function (query,taskCode) {
        return fetchVirtualAccountList(query,taskCode);
      },
      fetchVirtualAccountBalance: function (virtualAccountNo, virtualAccountCcy) {
        return fetchVirtualAccountBalance(virtualAccountNo, virtualAccountCcy);
      },
      maintenance: function () {
        return maintenance();
      },
      getNewModel: function () {
        return moveMoneyPayload();
      },
      fetchVAMEnabledAccounts: function (taskCode) {
        return fetchVAMEnabledAccounts(taskCode);
      },

      fetchAccessPoints : function() {
        return fetchAccessPoints();
      }
    };
  };

  return new MoveMoneyModel();
});

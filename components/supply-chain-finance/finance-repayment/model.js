define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for finance repayment. This file contains the model definition
   * for list of scales fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link FinanceRepaymentModel.init}</li>.
   *              <li>[getProperty()]{@link FinanceRepaymentModel.listFinances}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualAccountModel
   * @class VirtualAccountModel
   */
  const FinanceRepaymentModel = function () {
    const baseService = BaseService.getInstance(),

      /**
       * Private method to fetch the list of finances.
       *
       * @function financeSearchGet
       * @memberOf FinanceRepaymentModel
       * @returns {void}
       * @private
       */
      financeSearchGet = function (status) {
        return baseService.fetch({
          url: "supplyChainFinance/finances"
        });
      },
      /**
      * Private method to perform a batch call for all the finances.
      *
      * @function batchpost
      * @memberOf FinanceRepaymentModel
      * @returns {void}
      * @private
      */
      batchpost = function (payload) {
        const params = {},
            options = {
                url: "batch"
            };

        return baseService.batch(options, params, payload);
      },

      getNewModel = function () {
        return {
          id: null,

          amounts: [{
            type: "Repay",
            totalAmount: {
              amount: null,
              currency: null
            }
          }]

        };
      },
      /**
             * Private method to fetch a status for the Finances.
             *
             * @function financeStatusget
             * @memberOf FinanceRepaymentModel
             * @returns {void}
             * @private
             */
      financeStatusget = function (status) {
        return baseService.fetch({
          url: "enumerations/scfFinanceStatuses"
        });
      };

    return {
      financeSearchGet: financeSearchGet,
      financeStatusget: financeStatusget,
      batchpost: batchpost,
      getNewModel: getNewModel
    };
  };

  return new FinanceRepaymentModel();
});
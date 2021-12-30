define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for Redeem funds review Model.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class RedeemFundsReviewModel
   */
  const RedeemFundsReviewModel = function () {
    const baseService = BaseService.getInstance();
    let fireBatchDeferred;
    const fireBatch = function (deferred, subRequestList, type) {
      const options = {
        url: "batch",
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.batch(options, {
        type: type
      }, subRequestList);
    };
    let updateOrderDeferred;
    const updateOrder = function (investmentAccountId, instructionId, data, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/instructions/{instructionId}",
          data: data,
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          investmentAccountId: investmentAccountId,
          instructionId: instructionId
        };

      baseService.update(options, params);
    };

    return {
      fireBatch: function (batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      updateOrder: function (investmentAccountId, instructionId, data) {
        updateOrderDeferred = $.Deferred();
        updateOrder(investmentAccountId, instructionId, data, updateOrderDeferred);

        return updateOrderDeferred;
      }
    };
  };

  return new RedeemFundsReviewModel();
});
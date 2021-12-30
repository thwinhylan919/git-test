define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const selfPayeeModel = function() {
    const baseService = BaseService.getInstance();
    let getTransferDataDeferred;
    const getTransferData = function(paymentId, isPaylater, deferred) {
      let url;

      if (isPaylater) {
        url = "payments/instructions/transfers/self/" + paymentId;
      } else {
        url = "payments/transfers/self/" + paymentId;
      }

      const options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getRepeatDeferred;
    const getRepeateIntervals = function(deferred) {
      const options = {
        url: "enumerations/paymentFrequency",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let verifyTransferWalletDeferred;
    const verifyTransferWallet = function( paymentId,deferred) {
      const options = {
          url: "wallets/transfer/{paymentId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          paymentId: paymentId
        };

      baseService.patch(options, params);
    };

    return {
      getTransferData: function(paymentId, isPaylater) {
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, isPaylater, getTransferDataDeferred);

        return getTransferDataDeferred;
      },
      verifyTransferWallet: function(param1) {
        verifyTransferWalletDeferred = $.Deferred();
        verifyTransferWallet(param1,verifyTransferWalletDeferred);

        return verifyTransferWalletDeferred;
      },
      getRepeateIntervals: function() {
        getRepeatDeferred = $.Deferred();
        getRepeateIntervals(getRepeatDeferred);

        return getRepeatDeferred;
      },
      /**
       * Fetches forex deals list for the user.
       *
       * @param {string} dealId - Contains selected currency for filter.
       * @returns {Promise}  Returns the promise object.
       */
      fetchForexDealList: function(dealId) {
        return baseService.fetch({
          url: "forexDeals?dealId={dealId}"
        }, {
          dealId: dealId
        });
      }
    };
  };

  return new selfPayeeModel();
});
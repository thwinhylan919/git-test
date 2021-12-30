define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const WalletPayModel = function() {
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let walletId, fetchTransactionsDeferred;
    const fetchTransactions = function(deferred) {
        const options = {
            url: "wallets/{walletId}/transactions?noOfTransactions=3",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: walletId
          };

        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid wallet Id. ";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function(wId) {
        modelInitialized = true;
        walletId = wId;

        return modelInitialized;
      },
      fetchTransactions: function() {
        objectInitializedCheck();
        fetchTransactionsDeferred = $.Deferred();
        fetchTransactions(fetchTransactionsDeferred);

        return fetchTransactionsDeferred;
      }
    };
  };

  return new WalletPayModel();
});
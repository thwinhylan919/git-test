define([
  "baseService",
  "jquery"
], function(BaseService, $) {
  "use strict";

  /**
   * This is a model for favorites.
   *
   * @return {Object} Containing functions related to favorite transactions.
   */
  const FavoritesModel = function() {
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let fireBatchDeferred;
    const fireBatch = function(batchData, batchId, deferred) {
      const options = {
        headers: {
          BATCH_ID: batchId
        },
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {}, batchData);
    };
    let deleteFavouriteDeferred;
    const deleteFavourite = function(paymentId, transactionType, deferred) {
      const options = {
        url: "payments/favorites?transactionId={paymentId}&&type={transactionType}",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      },
        params = {
          paymentId: paymentId,
          transactionType: transactionType
        };

      baseService.remove(options, params);
    };
    let getFavoritesDeferred;
    const getFavoritesDetails = function(deferred) {
        const options = {
          url: "payments/favorites",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      deleteFavourite: function(paymentId, transactionType) {
        deleteFavouriteDeferred = $.Deferred();
        deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);

        return deleteFavouriteDeferred;
      },
      getFavoritesDetails: function() {
        objectInitializedCheck();
        getFavoritesDeferred = $.Deferred();
        getFavoritesDetails(getFavoritesDeferred);

        return getFavoritesDeferred;
      },
      fireBatch: function(batchData, batchId) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, batchId, fireBatchDeferred);

        return fireBatchDeferred;
      }
    };
  };

  return new FavoritesModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model file for Product Requirements section. This file contains the model definition
   * for product requirements section and exports the Requirements model which can be used
   * as a component in any form in which user's product requirements are required.
   *
   * @namespace Wallet~WalletModel
   * @class
   * @Notifications {string} - gender of the applicant
   */
  const WalletModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    const Model = function() {
      this.title = "";
      this.amount = "";
      this.type = "";
      this.Bill = "";
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let walletId, fetchNotificationsDeferred;
    const fetchNotifications = function(deferred) {
      const options = {
          url: "wallets/{walletId}/notifications",
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
    };
    let saveModelDeferred;
    const saveModel = function(model, deferred) {
        const options = {
          url: "wallets/{walletId}/transfer",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.add(options);
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
      init: function(walletIdentifier) {
        walletId = walletIdentifier || undefined;
        modelInitialized = true;

        return modelInitialized;
      },
      fetchNotifications: function() {
        objectInitializedCheck();
        fetchNotificationsDeferred = $.Deferred();
        fetchNotifications(fetchNotificationsDeferred);

        return fetchNotificationsDeferred;
      },
      /**
       * Method to get new instance of Asset Information model. This method is a static member
       * of AssetsInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * AssetsInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {Object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf AssetsInfoModel
       * @returns Model
       */
      getNewModel: function() {
        return new Model();
      },
      saveModel: function(walletModel) {
        saveModelDeferred = $.Deferred();
        saveModel(walletModel, saveModelDeferred);

        return saveModelDeferred;
      }
    };
  };

  return new WalletModel();
});
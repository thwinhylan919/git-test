define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Create Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsCreateModel
   */
  const PurchaseMutualFundModel = function() {
    const baseService = BaseService.getInstance();
    let deleteOrderDeferred;
    /**
     * Private method to delete the order based on instructionId.
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function deleteOrder
     * @memberOf ErrorModel
     * @param {String} investmentAccount - payload to pass
     * @param {String} instructionId - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const deleteOrder = function(investmentAccount, instructionId, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/instructions/{instructionId}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },

        params = {
          investmentAccountId: investmentAccount,
          instructionId: instructionId
        };

      baseService.remove(options, params);
    };

    return {
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function deleteOrder
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {string} instructionId - An object type String.
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.deleteOrder().done(function(data) {
       *
       *       });
       */
      deleteOrder: function(investmentAccountId, instructionId) {
        deleteOrderDeferred = $.Deferred();
        deleteOrder(investmentAccountId, instructionId, deleteOrderDeferred);

        return deleteOrderDeferred;
      }
    };
  };

  return new PurchaseMutualFundModel();
});

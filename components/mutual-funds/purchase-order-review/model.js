define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Create Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsCreateModel
   */
  const PurchaseMutualFundModel = function () {
    const baseService = BaseService.getInstance();
    let purchaseOrderDeferred;
    /**
     * Private method to create a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function createPurchaseOrder
     * @memberOf ErrorModel
     * @param {string} investmentAccountId - Data to be inserted
     * @param {Object} data - Data to be inserted
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const createPurchaseOrder = function (investmentAccountId, data, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/holdings",
          data: data,
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          investmentAccountId: investmentAccountId
        };

      baseService.add(options, params);
    };
    let updateOrderDeferred;
    /**
     * Private method to update a purchase order
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function updateOrder
     * @memberOf ErrorModel
     * @param {string} investmentAccountId - investment account number
     * @param {string} instructionId - instruction id
     * @param {Object} data - Data to be inserted
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
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

    return {
      fireBatch: function (batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      /**
       * Public method to add the new service request
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addServiceRequest
       * @memberOf ServiceRequestsViewModel
       * @param {string} investmentAccountId - payload to pass
       * @param {Object} data - payload to pass
       * @returns {Object} addServiceRequestDeferred
       * @example
       *      PurchaseMutualFund.createPurchaseOrder().then(function (investmentAccountId,data) {
       *
       *      });
       */
      createPurchaseOrder: function (investmentAccountId, data) {
        purchaseOrderDeferred = $.Deferred();
        createPurchaseOrder(investmentAccountId, data, purchaseOrderDeferred);

        return purchaseOrderDeferred;
      },
      /**
       * Public method to update a purchase order
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function updateOrder
       * @memberOf ServiceRequestsViewModel
       * @param {string} investmentAccountId - investment account number
       * @param {string} instructionId - instruction id
       * @param {Object} data - payload to pass
       * @returns {Object} addServiceRequestDeferred
       * @example
       *      PurchaseMutualFund.createPurchaseOrder().then(function (investmentAccountId,data) {
       *
       *      });
       */
      updateOrder: function (investmentAccountId, instructionId, data) {
        updateOrderDeferred = $.Deferred();
        updateOrder(investmentAccountId, instructionId, data, updateOrderDeferred);

        return updateOrderDeferred;
      }
    };
  };

  return new PurchaseMutualFundModel();
});
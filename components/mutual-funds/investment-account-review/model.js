define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request global Model<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class OrderStatusModel
   */
  const OrderStatusModel = function() {

      const baseService = BaseService.getInstance();
      let investmentAccountDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function createInvestmentAccount
       * @memberOf ErrorModel
       * @param {Object} data - Payload to create account
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
       const createInvestmentAccount = function (data, deferred) {
         const
           options = {
             url: "accounts/investmentAccounts",
             data: data,
             success: function (data, status, jqXhr) {
               deferred.resolve(data, status, jqXhr);
             }
           };

         baseService.add(options);
       };

    return {
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentAccounts
       * @memberOf ServiceRequestsSearchModel
       * @param {Object} data - Payload to pass.
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.getInvestmentAccounts().done(function(data) {
       *
       *       });
       */
      createInvestmentAccount: function(data) {
        investmentAccountDeferred = $.Deferred();
        createInvestmentAccount(data,investmentAccountDeferred);

        return investmentAccountDeferred;
      }
    };
  };

  return new OrderStatusModel();
});

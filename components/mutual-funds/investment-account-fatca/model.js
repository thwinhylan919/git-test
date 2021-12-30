define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request global Model<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class OrderStatusModel
   */

  const OrderStatusModel = function() {

      const baseService = BaseService.getInstance();
      let fetchCountriesDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchCountries
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchCountries = function(deferred) {
        const options = {
          url: "enumerations/country",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }

        };

        baseService.fetch(options);
      };

      let fetchDocumentsDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchDocuments
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchDocuments = function(deferred) {
        const options = {
          url: "enumerations/taxIdentificationDocType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }

        };

        baseService.fetch(options);
      };

      let fetchCurrenciesDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchCurrencies
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchCurrencies = function(deferred) {
        const options = {
          url: "currency",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }

        };

        baseService.fetch(options);
      };

    return {
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchCountries
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       OrderStatusModel.fetchCountries().done(function(data) {
       *
       *       });
       */

      fetchCountries: function() {
        fetchCountriesDeferred = $.Deferred();
        fetchCountries(fetchCountriesDeferred);

        return fetchCountriesDeferred;
      },
      fetchDocuments: function() {
        fetchDocumentsDeferred = $.Deferred();
        fetchDocuments(fetchDocumentsDeferred);

        return fetchDocumentsDeferred;
      },
      fetchCurrencies: function() {
        fetchCurrenciesDeferred = $.Deferred();
        fetchCurrencies(fetchCurrenciesDeferred);

        return fetchCurrenciesDeferred;
      }
    };
  };

  return new OrderStatusModel();
});

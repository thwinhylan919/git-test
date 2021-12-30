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
    let fundCategoryDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchFundCategory
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchFundCategory = function (deferred) {
      const
        options = {
          url: "schemeCategories",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let schemeDetailsDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemeDetails
     * @memberOf ErrorModel
     * @param {string} schemeId - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemeDetails = function (schemeId, deferred) {
      const
        options = {
          url: "schemes/{schemeId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },

        params = {
          schemeId: schemeId
        };

      baseService.fetch(options, params);
    };
    let schemeNameDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemeName
     * @memberOf ErrorModel
     * @param {string} fundHouseCode - An object type String
     * @param {string} schemeCategory - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemeName = function (fundHouseCode, schemeCategory, deferred) {
      const
        options = {
          url: "schemes?fundHouseCode={fundHouseCode}&schemeCategory={schemeCategory}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },

        params = {
          fundHouseCode: fundHouseCode,
          schemeCategory: schemeCategory
        };

      baseService.fetch(options, params);
    };

    let existingSchemesDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchExistingSchemes
     * @memberOf ErrorModel
     * @param {string} accountId - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchExistingSchemes = function (accountId, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{accountId}/holdings",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },

        params = {
          accountId: accountId
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFundCategory
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       PurchaseMutualFund.fetchFundCategory().done(function(data) {
       *
       *       });
       */
      fetchFundCategory: function () {
        fundCategoryDeferred = $.Deferred();
        fetchFundCategory(fundCategoryDeferred);

        return fundCategoryDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemeDetails
       * @memberOf PurchaseMutualFundModel
       * @param {string} schemeId - Service request id for request to be updated.
       * @returns {Object} - DeferredObject.
       * @example
       *       PurchaseMutualFund.fetchSchemeDetails(schemeId).done(function(data) {
       *
       *       });
       */
      fetchSchemeDetails: function (schemeId) {
        schemeDetailsDeferred = $.Deferred();
        fetchSchemeDetails(schemeId, schemeDetailsDeferred);

        return schemeDetailsDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemeName
       * @memberOf PurchaseMutualFundModel
       * @param {string} fundHouseCode - Fund house code.
       * @param {string} schemeCategory - Scheme category.
       * @returns {Object} - DeferredObject.
       * @example
       *       PurchaseMutualFund.fetchSchemeName(fundHouseCode, schemeCategory).done(function(data) {
       *
       *       });
       */
      fetchSchemeName: function (fundHouseCode, schemeCategory) {
        schemeNameDeferred = $.Deferred();
        fetchSchemeName(fundHouseCode, schemeCategory, schemeNameDeferred);

        return schemeNameDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchExistingSchemes
       * @memberOf PurchaseMutualFundModel
       * @param {string} accountId - Service request id for request to be updated.
       * @returns {Object} - DeferredObject.
       * @example
       *       PurchaseMutualFund.fetchExistingSchemes(accountId).done(function(data) {
       *
       *       });
       */
      fetchExistingSchemes: function (accountId) {
        existingSchemesDeferred = $.Deferred();
        fetchExistingSchemes(accountId, existingSchemesDeferred);

        return existingSchemesDeferred;
      }
    };
  };

  return new PurchaseMutualFundModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  const ThirdPartyConsentModel = function() {
    const Model = function() {
        this.accountAccessModel = {
          accountAccessId: null,
          accessPointId: null,
          accountType: null,
          accessLevel: null,
          accessStatus: null,
          accountExclusionDTOs: []
        };
      },
      /**
       * baseService instance through which all the rest calls will be made.
       *
       * @attribute baseService
       * @type {Object} BaseService Instance
       * @private
       */
      baseService = BaseService.getInstance();
    /**
     * This function fires a batch request
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fireBatch - fetches the batch details
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {Object} batchRequest      - request details
     * @param {Object} type      - batch request type
     * @example ThirdPartyConsentModel.fireBatch(batchRequest, type).then();
     * @returns {void}
     */
    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };
    /**
     * fetch the list of accounts
     * @function fetchAccounts - fetch the list of accounts
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     *  @param {Object} accessPointId  - mapped access point id
     * @example ThirdPartyConsentModel.fetchAccounts(accessPointId).then();
     * @returns {void}
     */
    let fetchAccountsDeferred;
    const fetchAccounts = function(deferred, accessPointId) {
      const params = {
          accessPointId: accessPointId
        },
        options = {
          url: "me/accessPointAccount?accessPointId={accessPointId}&accountType=CSA&accountType=LON&accountType=TRD",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * GetNewModel - fetch the model object.
       *
       * @returns {Object}  Returns the model object.
       */
      getNewModel: function() {
        return new Model();
      },
      /**
       * FetchAccessPoints - fetch the list of access points.
       *
       * @param {Object} type  - Access point type.
       * @returns {Promise}  Returns the promise object.
       */
      fetchAccessPoints: function(type) {
        const params = {
            type: type
          },
          options = {
            url: "accessPoints?type={type}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchSetup - fetches the setup if it exists.
       *
       * @param {Object} accessPointId  - Mapped access point id.
       * @returns {Promise}  Returns the promise object.
       */
      fetchSetup: function(accessPointId) {
        const params = {
            accessPointId: accessPointId
          },
          options = {
            url: "me/accessPointAccount/{accessPointId}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchPreferences - fetches the user preferences.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchPreferences: function() {
        const options = {
          url: "me/preferences?userID"
        };

        return baseService.fetch(options);
      },
      /**
       * This function fires a batch request
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function fireBatch - fetches the batch details
       * @memberOf ProductService
       * @param {Object} batchRequest      - Request details.
       * @param {Object} type      - Batch request type.
       * @example ThirdPartyConsentModel.fireBatch(batchRequest, type).then();
       * @returns {Object} FireBatchDeferred - deferred object used to store data if successfully fetched.
       */
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      /**
       * fetch the list of accounts
       * @function fetchAccounts - fetch the list of accounts
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       * @memberOf ProductService
       *  @param {Object} accessPointId  - mapped access point id
       * @example ThirdPartyConsentModel.fetchAccounts(accessPointId).then();
       * @returns {Object} fetchAccountsDeferred - deferred object used to store data if successfully fetched
       */
      fetchAccounts: function(accessPointId) {
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred, accessPointId);

        return fetchAccountsDeferred;
      }
    };
  };

  return new ThirdPartyConsentModel();
});
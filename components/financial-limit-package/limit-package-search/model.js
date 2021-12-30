define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const LimitPackageModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * Method to fetch Access Point
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function fetchAccessPoint
     * @param {object} deferred- resolved for successful request
     * @returns {void}
     * @example LimitPackageModel.fetchAccessPoint(deferred);
     * @private
     */
    let fetchAccessPointDeffered;
    const fetchAccessPoint = function(deffered) {
      const options = {
        url: "accessPoints",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * Method to fetch Access Point
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function fetchAccessPointGroup
     * @param {object} deferred- resolved for successful request
     * @returns {void}
     * @example LimitPackageModel.fetchAccessPointGroup(deferred);
     * @private
     */
    let fetchAccessPointGroupDeffered;
    const fetchAccessPointGroup = function(deffered) {
      const options = {
        url: "accessPointGroups",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * Method to fetch Enterprise Roles
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function fetchEnterpriseRoles
     * @param {object} deferred- resolved for successful request
     * @returns {void}
     * @example LimitPackageModel.fetchEnterpriseRoles(deferred);
     * @private
     */
    let fetchEnterpriseRolesDeffered;
    const fetchEnterpriseRoles = function(deffered) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * Method to fetch Currencies
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function fetchCurrencies
     * @param {object} deferred- resolved for successful request
     * @returns {void}
     * @example LimitPackageModel.fetchCurrencies(deferred);
     * @private
     */
    let fetchCurrenciesDeffered;
    const fetchCurrencies = function(deffered) {
      const options = {
        url: "currency",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * Method to fetch Packages
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function fetchPackages
     * @param {object} search_params- transactionGroupId for creating Transaction Group
     * @param {object} deferred- resolved for successful request
     * @returns {void}
     * @example LimitPackageModel.fetchPackages(search_params, deferred);
     * @private
     */
    let fetchPackagesDeffered;
    const fetchPackages = function(search_params, deffered) {
      const params = {
          name: search_params.name,
          description: search_params.description,
          assignableEntities: search_params.assignableEntities[0].key.value ? JSON.stringify(search_params.assignableEntities) : search_params.assignableEntities[0].key.value,
          currency: search_params.currency,
          accessPointValue: search_params.accessPointValue,
          accessPointGroupType: search_params.accessPointGroupType,
          fromDate: search_params.fromDate,
          toDate: search_params.toDate
        },
        options = {
          url: "limitPackages?name={name}&description={description}&assignableEntities={assignableEntities}&currency={currency}&accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}&fromDate={fromDate}&toDate={toDate}",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
 let fetchSystemConfigurationDetailsDeferred;
        const fetchSystemConfigurationDetails = function(deferred) {
          const options = {
            url: "configurations/base/limitconfig/properties/ACCESS_POINT_SPECIFIC_LIMIT",
            success: function(data) {
              deferred.resolve(data);
            }
          };

          baseService.fetch(options);
        };

    return {
      /**
       * This function fires a GET request to search the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function fetchAccessPoint
       * @memberOf ProductService
       * @param {Object} deferred- - Resolved for successful request.
       * @example LimitPackageModel.fetchAccessPoint(deferred);
       * @returns {Object} FetchAccessPointDeffered - deferred object used to store data if successfully fetched.
       */
      fetchAccessPoint: function() {
        fetchAccessPointDeffered = $.Deferred();
        fetchAccessPoint(fetchAccessPointDeffered);

        return fetchAccessPointDeffered;
      },
      /**
       * This function fires a GET request to search the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function fetchAccessPointGroup
       * @memberOf ProductService
       * @param {Object} deferred- - Resolved for successful request.
       * @example LimitPackageModel.fetchAccessPointGroup(deferred);
       * @returns {Object} FetchAccessPointGroupDeffered - deferred object used to store data if successfully fetched.
       */
      fetchAccessPointGroup: function() {
        fetchAccessPointGroupDeffered = $.Deferred();
        fetchAccessPointGroup(fetchAccessPointGroupDeffered);

        return fetchAccessPointGroupDeffered;
      },
      /**
       * This function fires a GET request to search the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function fetchEnterpriseRoles
       * @memberOf ProductService
       * @param {Object} deferred- - Resolved for successful request.
       * @example LimitPackageModel.fetchEnterpriseRoles(deferred);
       * @returns {Object} FetchEnterpriseRolesDeffered - deferred object used to store data if successfully fetched.
       */
      fetchEnterpriseRoles: function() {
        fetchEnterpriseRolesDeffered = $.Deferred();
        fetchEnterpriseRoles(fetchEnterpriseRolesDeffered);

        return fetchEnterpriseRolesDeffered;
      },
      /**
       * This function fires a GET request to search the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function fetchCurrencies
       * @memberOf ProductService
       * @param {Object} deferred- - Resolved for successful request.
       * @example LimitPackageModel.fetchCurrencies(deferred);
       * @returns {Object} FetchCurrenciesDeffered - deferred object used to store data if successfully fetched.
       */
      fetchCurrencies: function() {
        fetchCurrenciesDeffered = $.Deferred();
        fetchCurrencies(fetchCurrenciesDeffered);

        return fetchCurrenciesDeffered;
      },
      /**
       * This function fires a GET request to search the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function fetchPackages
       * @memberOf ProductService
       * @param {Object} params      - Object containg search parameters.
       * @example LimitPackageModel.fetchPackages(deferred);
       * @returns {Object} FetchPackagesDeffered - deferred object used to store data if successfully fetched.
       */
      fetchPackages: function(params) {
        fetchPackagesDeffered = $.Deferred();
        fetchPackages(params, fetchPackagesDeffered);

        return fetchPackagesDeffered;
      },
      fetchSystemConfigurationDetails: function() {
          fetchSystemConfigurationDetailsDeferred = $.Deferred();
          fetchSystemConfigurationDetails(fetchSystemConfigurationDetailsDeferred);

          return fetchSystemConfigurationDetailsDeferred;
        }
    };
  };

  return new LimitPackageModel();
});
define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const AccessPointGroupCreateModel = function() {
    const Model = function() {
        this.groupModel = {
          groupCode: null,
          description: null,
          internalAccessPoints: null,
          externalAccessPoints: null,
          accessPoints: null,
          version: null
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
     * This function fires a GET request to fetch the access point details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchAccessPoint
     * @memberOf ProductService
     * @param {String} accessType      - String indicating the access type of the access pont
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @example AccessPointGroupCreateModel.fetchAccessPoint('accessType',deferred);
     * @returns {void}
     */
    let fetchAccessPointDeferred;
    const fetchAccessPoint = function(accessType, deferred) {
      const options = {
          url: "accessPoints?accessType={accessType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          accessType: accessType
        };

      baseService.fetch(options, params);
    };
    /**
     * This function fires a GET request to fetch the list of access point groups
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function getAccessPointGroups
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @example AccessPointGroupCreateModel.getAccessPointGroups(deferred);
     * @returns {void}
     */
    let getAccessPointGroupsDeffered;
    const getAccessPointGroups = function(deferred) {
      const options = {
        url: "accessPointGroups",
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
      getNewModel: function() {
        return new Model();
      },
      /**
       * This function fires a GET request to fetch the access point details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function fetchAccessPoint
       * @memberOf ProductService
       * @param {string} accessType      - String indicating the access type of the access pont.
       * @example AccessPointGroupCreateModel.fetchAccessPoint('accessType');
       * @returns {Object} FetchAccessPointDeferred - deferred object used to store data if successfully fetched.
       */
      fetchAccessPoint: function(accessType) {
        fetchAccessPointDeferred = $.Deferred();
        fetchAccessPoint(accessType, fetchAccessPointDeferred);

        return fetchAccessPointDeferred;
      },
      /**
       * This function fires a GET request to fetch the list of access point groups
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function getAccessPointGroups
       * @memberOf ProductService
       * @example AccessPointGroupCreateModel.getAccessPointGroups();
       * @returns {Object} GetAccessPointGroupsDeffered - deferred object used to store data if successfully fetched.
       */
      getAccessPointGroups: function() {
        getAccessPointGroupsDeffered = $.Deferred();
        getAccessPointGroups(getAccessPointGroupsDeffered);

        return getAccessPointGroupsDeffered;
      }
    };
  };

  return new AccessPointGroupCreateModel();
});
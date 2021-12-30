define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const AccessPointGroupSearchModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * This function fires a GET request to search the access point group
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function search
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {Object} queryParams      - object containg search parameters
     * @example AccessPointGroupSearchModel.search(deferred,queryParams);
     * @returns {void}
     */
    let searchDeffered;
    const search = function(deferred, queryParams) {
      const params = {
          groupCode: queryParams.groupCode,
          description: queryParams.description
        },
        options = {
          url: "accessPointGroups?accessPointGroupId={groupCode}&description={description}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    /**
     * This function fires a GET request to fetch the access point group details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function getAccessPointGroup
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {String} groupCode      - access point group code
     * @example AccessPointGroupSearchModel.getAccessPointGroup(deferred,groupCode);
     * @returns {void}
     */
    let getAccessPointGroupDeffered;
    const getAccessPointGroup = function(deferred, groupCode) {
      const params = {
          groupCode: groupCode
        },
        options = {
          url: "accessPointGroups/{groupCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    /**
     * This function fires a GET request to fetch the access point  details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function getAccessPoint
     * @memberOf ProductService
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @param {String} accessPoint      - access point group code
     * @example AccessPointGroupSearchModel.getAccessPoint(deferred,accessPoint);
     * @returns {void}
     */
    let getAccessPointDeffered;
    const getAccessPoint = function(deferred, accessPoint) {
      const params = {
          accessPoint: accessPoint
        },
        options = {
          url: "accessPoints/{accessPoint}",
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
       * This function fires a GET request to search the access point group
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function search
       * @memberOf ProductService
       * @param {Object} queryParams      - Object containg search parameters.
       * @example AccessPointGroupSearchModel.search(queryParams);
       * @returns {Object} SearchDeffered - deferred object used to store data if successfully fetched.
       */
      search: function(queryParams) {
        searchDeffered = $.Deferred();
        search(searchDeffered, queryParams);

        return searchDeffered;
      },
      /**
       * This function fires a GET request to fetch the access point group details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function getAccessPointGroup
       * @memberOf ProductService
       * @param {string} groupCode      - Access point group code.
       * @example AccessPointGroupSearchModel.getAccessPointGroup(groupCode);
       * @returns {Object} GetAccessPointGroupDeffered - deferred object used to store data if successfully fetched.
       */
      getAccessPointGroup: function(groupCode) {
        getAccessPointGroupDeffered = $.Deferred();
        getAccessPointGroup(getAccessPointGroupDeffered, groupCode);

        return getAccessPointGroupDeffered;
      },
      /**
       * This function fires a GET request to fetch the access point  details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched.
       *
       * @function getAccessPoint
       * @memberOf ProductService
       * @param {string} accessPoint      - Access point group code.
       * @example AccessPointGroupSearchModel.getAccessPoint(accessPoint);
       * @returns {Object} GetAccessPointDeffered - deferred object used to store data if successfully fetched.
       */
      getAccessPoint: function(accessPoint) {
        getAccessPointDeffered = $.Deferred();
        getAccessPoint(getAccessPointDeffered, accessPoint);

        return getAccessPointDeffered;
      }
    };
  };

  return new AccessPointGroupSearchModel();
});
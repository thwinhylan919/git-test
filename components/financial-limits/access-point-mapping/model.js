/**
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AccessPointLimitPackageModel = function() {
    const baseService = BaseService.getInstance();
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
       * ListAccessPointGroup - fetches the AccessPointGroup List.
       *
       * @returns {Promise}  Returns the promise object.
       */
      listAccessPointGroup: function() {
        const options = {
          url: "accessPointGroups"
        };

        return baseService.fetch(options);
      },
      /**
       * ListLimitPackage - fetches the LimitPackages List.
       *
       * @returns {Promise}  Returns the promise object.
       */
      listLimitPackage: function() {
        const options = {
          url: "limitPackage"
        };

        return baseService.fetch(options);
      },
      /**
       * ListAccessPoint - fetches the Access Point List.
       *
       * @param {string} accessPointType - Indicates the type for which access points are to be fetched.
       * @returns {Promise}  Returns the promise object.
       */
      listAccessPoint: function(accessPointType) {
        const params = {
          accessPointType: accessPointType
        },

         options = {
          url: "accessPoints?accessType={accessPointType}"
        };

        return baseService.fetch(options,params);
      },
      fetchSystemConfigurationDetails: function() {
          fetchSystemConfigurationDetailsDeferred = $.Deferred();
          fetchSystemConfigurationDetails(fetchSystemConfigurationDetailsDeferred);

          return fetchSystemConfigurationDetailsDeferred;
        }
    };
  };

  return new AccessPointLimitPackageModel();
});
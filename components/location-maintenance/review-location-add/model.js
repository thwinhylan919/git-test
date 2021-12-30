define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewLocationAddModel = function() {
      let fetchSupportedServicesDeferred;
      const fetchSupportedServices = function (type, deferred) {
       const options = {
         url: "locator/services?type=" + type.toUpperCase(),
         success: function (data) {
            deferred.resolve(data);
           }
         };

         baseService.fetch(options);
       };
      let addAtmLocationDeferred;
      const addAtmLocation = function(payload, deferred) {
        const options = {
          url: "locator/atms",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };
      let addBranchLocationDeferred;
      const addBranchLocation = function(payload, deferred) {
        const options = {
          url: "locator/branches",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };

       return {
        fetchSupportedServices: function (type) {
        fetchSupportedServicesDeferred = $.Deferred();
        fetchSupportedServices(type, fetchSupportedServicesDeferred);

        return fetchSupportedServicesDeferred;
        },
        addAtmLocation: function(payload) {
          addAtmLocationDeferred = $.Deferred();
          addAtmLocation(payload, addAtmLocationDeferred);

          return addAtmLocationDeferred;
        },
        addBranchLocation: function(payload) {
          addBranchLocationDeferred = $.Deferred();
          addBranchLocation(payload, addBranchLocationDeferred);

          return addBranchLocationDeferred;
        }
      };
    };

  return new ReviewLocationAddModel();
});
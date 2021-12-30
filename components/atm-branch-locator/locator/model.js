define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ATMBranchLocatorModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * This function creates the customer preferences of valid party Id,
     * posts entered details filled in the form as request payload
     * @function createCP
     * @memberOf CreateCPModel
     **/
    let listLocationsDeferred;
    const listLocations = function(deferred) {
      const options = {
        url: "locator",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let getLocationsDeferred;
    const getLocations = function(lat, lng, type, radius, deferred) {
      let uri;

      if (type === "ATM") {
        uri = "locator/atms?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + "&type=" + type;
      } else if (type === "BRANCH") {
        uri = "locator/branches?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + "&type=" + type;
      } else {
        uri = "locator?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + "&type=" + type;
      }

      const options = {
        url: uri,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let getDetailsDeferred;
    const getDetails = function(branchCode, type, deferred) {
      let uri;

      if (type === "ATM")
        {uri = "locator/atms/{branchCode}";}
      else
        {uri = "locator/branches/{branchCode}";}

      const params = {
          branchCode: branchCode
        },
        options = {
          url: uri,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.fetch(options, params);
    };
    let showAllServicesDeferred;
    const showAllServices = function(type, deferred) {
      const uri = "locator/services?type=" + type,
        options = {
          url: uri,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.fetch(options);
    };
    let refineServiceSearchDeferred;
    const refineServiceSearch = function(type, serviceId, lat, lng, radius, deferred) {
      let serviceids = "";

      for (let i = 0; i < serviceId.length; i++)
        {serviceids = serviceids + "&supportedServices=" + serviceId[i];}

      const uri = "locator?latitude=" + lat + "&longitude=" + lng + "&radius=" + radius + serviceids + "&type=" + type,
        options = {
          url: uri,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.fetch(options);
    };

    return {
      listLocations: function() {
        listLocationsDeferred = $.Deferred();
        listLocations(listLocationsDeferred);

        return listLocationsDeferred;
      },
      getLocations: function(lat, lng, type, radius) {
        getLocationsDeferred = $.Deferred();
        getLocations(lat, lng, type, radius, getLocationsDeferred);

        return getLocationsDeferred;
      },
      getDetails: function(branchCode, type) {
        getDetailsDeferred = $.Deferred();
        getDetails(branchCode, type, getDetailsDeferred);

        return getDetailsDeferred;
      },
      showAllServices: function(type) {
        showAllServicesDeferred = $.Deferred();
        showAllServices(type, showAllServicesDeferred);

        return showAllServicesDeferred;
      },
      refineServiceSearch: function(type, serviceId, lat, lng, radius) {
        refineServiceSearchDeferred = $.Deferred();
        refineServiceSearch(type, serviceId, lat, lng, radius, refineServiceSearchDeferred);

        return refineServiceSearchDeferred;
      }
    };
  };

  return new ATMBranchLocatorModel();
});
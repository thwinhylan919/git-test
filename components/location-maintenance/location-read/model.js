define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    LocationReadModel = function () {
      let fetchBranchDetailsDeferred;
      const fetchBranchDetails = function (id, deferred) {
        const params = {
          id: id
        },
          options = {
            url: "locator/branches/" + id,
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let fetchATMDetailsDeferred;
      const fetchATMDetails = function (id, deferred) {
        const params = {
          id: id
        },
          options = {
            url: "locator/atms/" + id,
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let fetchSupportedServicesDeferred;
      const fetchSupportedServices = function (type, deferred) {
        const params = { type: type },
          options = {
            url: "locator/services?type={type}",
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let deleteLocationDeferred;
      const deleteLocation = function (type, id, deferred) {
        const params = {
          type: type,
          id: id
        },
          options = {
            url: "locator/" + type + "/" + id,
            success: function (data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };

        baseService.remove(options, params);
      };

      return {
        fetchBranchDetails: function (id) {
          fetchBranchDetailsDeferred = $.Deferred();
          fetchBranchDetails(id, fetchBranchDetailsDeferred);

          return fetchBranchDetailsDeferred;
        },
        fetchATMDetails: function (id) {
          fetchATMDetailsDeferred = $.Deferred();
          fetchATMDetails(id, fetchATMDetailsDeferred);

          return fetchATMDetailsDeferred;
        },
        fetchSupportedServices: function (type) {
          fetchSupportedServicesDeferred = $.Deferred();
          fetchSupportedServices(type, fetchSupportedServicesDeferred);

          return fetchSupportedServicesDeferred;
        },
        deleteLocation: function (type, id) {
          deleteLocationDeferred = $.Deferred();
          deleteLocation(type, id, deleteLocationDeferred);

          return deleteLocationDeferred;
        }
      };
    };

  return new LocationReadModel();
});
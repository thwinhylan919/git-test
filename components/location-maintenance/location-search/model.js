define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    LocationSearchModel = function() {
      let fetchCountryDeferred;
      const fetchCountry = function(deferred) {
        const options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchATMBranchDeferred;
      const fetchATMBranch = function(searchParams, deferred) {
        let urlLocator;

        if (searchParams.type === "ATM") {
          urlLocator = "locator/atms?countryRegion=" + searchParams.countryRegion + "&city=" + searchParams.city + "&id=" + searchParams.id;
        } else if (searchParams.type === "BRANCH") {
          urlLocator = "locator/branches?countryRegion=" + searchParams.countryRegion + "&city=" + searchParams.city + "&id=" + searchParams.id;
        } else {
          urlLocator = "locator?countryRegion=" + searchParams.countryRegion + "&city=" + searchParams.city + "&id=" + searchParams.id;
        }

        const options = {
          url: urlLocator,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        fetchCountry: function() {
          fetchCountryDeferred = $.Deferred();
          fetchCountry(fetchCountryDeferred);

          return fetchCountryDeferred;
        },
        fetchATMBranch: function(params) {
          fetchATMBranchDeferred = $.Deferred();
          fetchATMBranch(params, fetchATMBranchDeferred);

          return fetchATMBranchDeferred;
        }
      };
    };

  return new LocationSearchModel();
});
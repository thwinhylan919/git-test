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
        const params = {
            countryRegion: searchParams.countryRegion,
            city: searchParams.city,
            id: searchParams.id
          },
          options = {
            url: "locator?countryRegion={params.countryRegion}&city={params.city}" ,
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options,params);
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
define([
    "jquery",
    "baseService"
  ], function($, BaseService) {
    "use strict";

    const AddFacilityModel = function() {
      const baseService = BaseService.getInstance();

      let fetchCurrencyDeferred;
      const fetchCurrency = function(deferred) {
        const options = {
          url: "currency",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      let fetchFacilityTypesDeferred;
      const fetchFacilityTypes = function(deferred) {
        const options = {
          url: "creditFacilities/facilityCategories",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {

        fetchCurrency: function() {
          fetchCurrencyDeferred = $.Deferred();
          fetchCurrency(fetchCurrencyDeferred);

          return fetchCurrencyDeferred;
        },

        fetchFacilityTypes: function() {
            fetchFacilityTypesDeferred = $.Deferred();
            fetchFacilityTypes(fetchFacilityTypesDeferred);

            return fetchFacilityTypesDeferred;
          }
      };
    };

    return new AddFacilityModel();
  });
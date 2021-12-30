define([
    "jquery",
    "baseService"
  ], function($, BaseService) {
    "use strict";

    const AddCollateralModel = function() {
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

      let fetchCollateralTypesDeferred;
      const fetchCollateralTypes = function(deferred) {
        const options = {
          url: "creditFacilities/collateralTypes",
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

        fetchCollateralTypes: function() {
            fetchCollateralTypesDeferred = $.Deferred();
            fetchCollateralTypes(fetchCollateralTypesDeferred);

            return fetchCollateralTypesDeferred;
          }
      };
    };

    return new AddCollateralModel();
  });
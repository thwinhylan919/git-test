define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TaxResidencyInfoModel = function() {
    const baseService = BaseService.getInstance();
    let fetchTaxResidenceCountriesDeferred;
    const fetchTaxResidenceCountries = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchTaxIdentificationTypesDeferred;
    const fetchTaxIdentificationTypes = function(countryCode, deferred) {
      const params = {
          countryCode: countryCode
        },
        options = {
          url: "enumerations/{countryCode}/taxIdentificationType",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchTaxResidenceCountries: function() {
        fetchTaxResidenceCountriesDeferred = $.Deferred();
        fetchTaxResidenceCountries(fetchTaxResidenceCountriesDeferred);

        return fetchTaxResidenceCountriesDeferred;
      },
      fetchTaxIdentificationTypes: function(countryCode) {
        fetchTaxIdentificationTypesDeferred = $.Deferred();
        fetchTaxIdentificationTypes(countryCode, fetchTaxIdentificationTypesDeferred);

        return fetchTaxIdentificationTypesDeferred;
      }
    };
  };

  return new TaxResidencyInfoModel();
});
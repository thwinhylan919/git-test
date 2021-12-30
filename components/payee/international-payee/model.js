define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const internationalPayeeModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let region, getNetworkTypesDeferred;
    const getNetworkTypes = function(deferred) {
      const options = {
          url: "enumerations/networkType?REGION={region}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          region: region
        };

      baseService.fetch(options, params);
    };
    let getCountriesDeferred;
    const getCountries = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBankDetailsBICDeferred;
    const getBankDetailsBIC = function(code, deferred) {
      const options = {
          url: "financialInstitution/bicCodeDetails/{BICCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          BICCode: code
        };

      baseService.fetch(options, params);
    };
    let getBankDetailsNCCDeferred;
    const getBankDetailsNCC = function(code, region, deferred) {
      const options = {
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          nationalClearingCode: code,
          nationalClearingCodeType: region
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Method to initialize the described model.
       */
      init: function(reg) {
        region = reg || undefined;
      },
      getNetworkTypes: function() {
        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(getNetworkTypesDeferred);

        return getNetworkTypesDeferred;
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);

        return getCountriesDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      },
      getBankDetailsNCC: function(code, region) {
        getBankDetailsNCCDeferred = $.Deferred();
        getBankDetailsNCC(code, region, getBankDetailsNCCDeferred);

        return getBankDetailsNCCDeferred;
      }
    };
  };

  return new internationalPayeeModel();
});
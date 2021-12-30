define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const domesticSepaPayeeModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let region, getPaymentTypesDeferred;
    const getPaymentTypes = function(deferred) {
      const options = {
          url: "enumerations/paymentType?REGION={region}",
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
    let getBankDetailsDeferred;
    const getBankDetails = function(code, deferred) {
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

    return {
      /**
       * Method to initialize the described model.
       */
      init: function(reg) {
        region = reg || undefined;
      },
      getPaymentTypes: function() {
        getPaymentTypesDeferred = $.Deferred();
        getPaymentTypes(getPaymentTypesDeferred);

        return getPaymentTypesDeferred;
      },
      getBankDetails: function(code) {
        getBankDetailsDeferred = $.Deferred();
        getBankDetails(code, getBankDetailsDeferred);

        return getBankDetailsDeferred;
      }
    };
  };

  return new domesticSepaPayeeModel();
});
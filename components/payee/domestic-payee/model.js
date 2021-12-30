define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const domesticIndiaPayeeModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getBankDetailsDCCDeferred;
    const getBankDetailsDCC = function(code, deferred) {
      const options = {
          url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          domesticClearingCodeType: "INDIA",
          domesticClearingCode: code
        };

      baseService.fetch(options, params);
    };

    return {
      getBankDetailsDCC: function(code) {
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, getBankDetailsDCCDeferred);

        return getBankDetailsDCCDeferred;
      }
    };
  };

  return new domesticIndiaPayeeModel();
});
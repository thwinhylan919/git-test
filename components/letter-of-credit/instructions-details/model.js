define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const InstructionsDetailsModel = function() {
    const baseService = BaseService.getInstance();
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

    return {
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      }
    };
  };

  return new InstructionsDetailsModel();
});
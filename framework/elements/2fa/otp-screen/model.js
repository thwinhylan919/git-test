define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  let params;
  const baseService = BaseService.getInstance(),
    OTPModel = function() {
      let resendOTPDeferred;
      const resendOTP = function(referenceNumber, deferred) {
        params = {
          referenceNumber: referenceNumber
        };

        const options = {
          url: "2fa/{referenceNumber}/resend",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(jqXHR) {
            deferred.reject(jqXHR);
          }
        };

        baseService.add(options, params);
      };

      return {
        resendOTP: function(referenceNumber) {
          resendOTPDeferred = $.Deferred();
          resendOTP(referenceNumber, resendOTPDeferred);

          return resendOTPDeferred;
        }
      };
    };

  return new OTPModel();
});
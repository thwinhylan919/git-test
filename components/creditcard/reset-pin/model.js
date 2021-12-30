define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const GeneratePinModel = function() {
    const creditCardValidationRequest = function() {
        this.expiryMonth = null;
        this.expiryYear = null;
        this.cvv = null;
      },
      pinRequest = function() {
        this.pin = null;
        this.dob = null;
      },
     baseService = BaseService.getInstance();
    let validateCardDetailsDeferred;
    const validateCardDetails = function(payload, serviceUrl, deferred) {
      const options = {
        url: serviceUrl,
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };

    return {
      getNewValidationModel: function() {
        return new creditCardValidationRequest();
      },
      getNewPinResetModel: function() {
        return new pinRequest();
      },
      validateCardDetails: function(payload, url) {
        validateCardDetailsDeferred = $.Deferred();
        validateCardDetails(payload, url, validateCardDetailsDeferred);

        return validateCardDetailsDeferred;
      },
      resetPin: function(payload, url) {
        const options = {
          url: url,
          data: payload
        };

        return baseService.add(options);
      }
    };
  };

  return new GeneratePinModel();
});

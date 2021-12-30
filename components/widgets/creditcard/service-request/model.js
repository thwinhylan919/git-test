define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const serviceRequestModel = function() {
    const baseService = BaseService.getInstance();
    let fetchServiceRequestDeferred;
    const fetchServiceRequest = function(deferred) {
      const options = {
        url: "servicerequest?status=PE&entity=CR",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchServiceRequest: function() {
        fetchServiceRequestDeferred = $.Deferred();
        fetchServiceRequest(fetchServiceRequestDeferred);

        return fetchServiceRequestDeferred;
      }
    };
  };

  return new serviceRequestModel();
});

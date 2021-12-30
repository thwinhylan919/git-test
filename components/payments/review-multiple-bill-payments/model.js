define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MultipleBillPaymentsModel = function() {
    const
      baseService = BaseService.getInstance();
    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };

    return {
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new MultipleBillPaymentsModel();
});
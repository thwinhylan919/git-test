define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MultiplePaymentsModel = function() {
    const
      baseService = BaseService.getInstance();
    let getPurposeDescDeferred;
    const getPurposeDesc = function(deferred) {
      const options = {
        url: "purposes/PC",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
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
      getPurposeDesc: function() {
        getPurposeDescDeferred = $.Deferred();
        getPurposeDesc(getPurposeDescDeferred);

        return getPurposeDescDeferred;
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new MultiplePaymentsModel();
});
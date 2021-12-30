define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const EntitlementSearchResultModel = function() {
    const baseService = BaseService.getInstance();

    this.getNewModel = function() {
      return new this.Model();
    };

    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
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

  return new EntitlementSearchResultModel();
});
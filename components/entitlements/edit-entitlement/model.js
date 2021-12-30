define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const EntitlementEditModel = function() {
    const baseService = BaseService.getInstance();
    let fetchResourceNameDeferred;
    const fetchResourceName = function(deferred) {
      const options = {
        url: "resources",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
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
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };

    return {
      fetchResourceName: function() {
        fetchResourceNameDeferred = $.Deferred();
        fetchResourceName(fetchResourceNameDeferred);

        return fetchResourceNameDeferred;
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new EntitlementEditModel();
});
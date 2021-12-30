define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const viewAuthenticationMaintenanceModel = function() {
    const baseService = BaseService.getInstance();
    let fetchTransactionsForMaintenanceDeferred;
    const fetchTransactionsForMaintenance = function(taskType, deferred) {
      const options = {
        url: "resourceTasks?aspects=2fa&taskType=" + taskType + "&view=list",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchSegementAuthenticationMaintenanceDeferred;
    const fetchSegementAuthenticationMaintenance = function(entityId, entityValue, deferred) {
      const options = {
        url: "authenticationMaintenances?targetType="+entityId+"&targetValue="+entityValue,
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
      fetchTransactionsForMaintenance: function(taskType) {
        fetchTransactionsForMaintenanceDeferred = $.Deferred();
        fetchTransactionsForMaintenance(taskType, fetchTransactionsForMaintenanceDeferred);

        return fetchTransactionsForMaintenanceDeferred;
      },
      fetchSegementAuthenticationMaintenance: function(entityId, entityValue) {
        fetchSegementAuthenticationMaintenanceDeferred = $.Deferred();
        fetchSegementAuthenticationMaintenance(entityId, entityValue, fetchSegementAuthenticationMaintenanceDeferred);

        return fetchSegementAuthenticationMaintenanceDeferred;
      }
    };
  };

  return new viewAuthenticationMaintenanceModel();
});

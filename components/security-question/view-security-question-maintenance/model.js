define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const viewSecurityQuestionMaintenanceModel = function () {
    const baseService = BaseService.getInstance();
    let fetchTransactionsForMaintenanceDeferred;
    const fetchTransactionsForMaintenance = function (maintenanceId, deferred) {
      const params = {
          maintenanceId: maintenanceId
        },
        options = {
          url: "securityQuestion?maintenanceId={maintenanceId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchTransactionsForMaintenance: function (maintenanceId) {
        fetchTransactionsForMaintenanceDeferred = $.Deferred();
        fetchTransactionsForMaintenance(maintenanceId, fetchTransactionsForMaintenanceDeferred);

        return fetchTransactionsForMaintenanceDeferred;
      }
    };
  };

  return new viewSecurityQuestionMaintenanceModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const createAuthenticationMaintenanceModel = function() {
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
    let fetchChallengesDeferred;
    const fetchChallenges = function(deferred, userSegment) {
      const options = {
          url: "configurations/authentication?userSegment={userSegment}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          userSegment: userSegment
        };

      baseService.fetch(options, params);
    };

    return {
      fetchTransactionsForMaintenance: function(taskType) {
        fetchTransactionsForMaintenanceDeferred = $.Deferred();
        fetchTransactionsForMaintenance(taskType, fetchTransactionsForMaintenanceDeferred);

        return fetchTransactionsForMaintenanceDeferred;
      },
      fetchChallenges: function(userSegment) {
        fetchChallengesDeferred = $.Deferred();
        fetchChallenges(fetchChallengesDeferred, userSegment);

        return fetchChallengesDeferred;
      }
    };
  };

  return new createAuthenticationMaintenanceModel();
});
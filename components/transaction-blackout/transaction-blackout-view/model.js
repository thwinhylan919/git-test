define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ViewBlackoutModel = function() {
    const baseService = BaseService.getInstance();
    let createBlackoutDeferred;
    const createBlackout = function(model, deferred) {
      const options = {
          url: "blackouts",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        },
        params = {
          model: model
        };

      baseService.add(options, params);
    };
    let fetchTaskNameDeferred;
    const fetchTaskName = function(taskId, deferred) {
      const options = {
        url: "resourceTasks/" + taskId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let fetchUserTypeDeferred;
    const fetchUserType = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      createBlackout: function(model) {
        createBlackoutDeferred = $.Deferred();
        createBlackout(model, createBlackoutDeferred);

        return createBlackoutDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);

        return fetchUserTypeDeferred;
      },
      fetchTaskName: function(taskId) {
        fetchTaskNameDeferred = $.Deferred();
        fetchTaskName(taskId, fetchTaskNameDeferred);

        return fetchTaskNameDeferred;
      }
    };
  };

  return new ViewBlackoutModel();
});
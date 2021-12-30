define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function TaskPurposeLandingModel() {
    const baseService = BaseService.getInstance();
    let fetchTaskListDeferred;
    const fetchTaskList = function(deferred) {
      const options = {
          url: "resourceTasks?aspects={aspects}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          aspects: "purpose-mapping"
        };

      baseService.fetch(options, params);
    };
    let fetchPurposeListDeferred;
    const fetchPurposeList = function(deferred) {
      const options = {
        url: "purposes/PC",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     This method fetches the task purpose mapping
     **/
    let fetchTaskPurposeMappingDeferred;
    const fetchTaskPurposeMapping = function(deferred) {
      const options = {
        url: "purposes/linkages",
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
      fetchPurposeList: function() {
        fetchPurposeListDeferred = $.Deferred();
        fetchPurposeList(fetchPurposeListDeferred);

        return fetchPurposeListDeferred;
      },
      fetchTaskPurposeMapping: function() {
        fetchTaskPurposeMappingDeferred = $.Deferred();
        fetchTaskPurposeMapping(fetchTaskPurposeMappingDeferred);

        return fetchTaskPurposeMappingDeferred;
      },
      fetchTaskList: function() {
        fetchTaskListDeferred = $.Deferred();
        fetchTaskList(fetchTaskListDeferred);

        return fetchTaskListDeferred;
      }
    };
  };
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function TaskPurposeAddModel() {
    const Model = function() {
        this.taskCode = null;
        this.purposeCode = null;
      },
      baseService = BaseService.getInstance();
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
    let createTaskPurposeMappingDeferred;
    const createTaskPurposeMapping = function(model, deferred) {
      const options = {
        url: "purposes/linkages",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchTaskPurposeMapping: function() {
        fetchTaskPurposeMappingDeferred = $.Deferred();
        fetchTaskPurposeMapping(fetchTaskPurposeMappingDeferred);

        return fetchTaskPurposeMappingDeferred;
      },
      createTaskPurposeMapping: function(model) {
        createTaskPurposeMappingDeferred = $.Deferred();
        createTaskPurposeMapping(model, createTaskPurposeMappingDeferred);

        return createTaskPurposeMappingDeferred;
      }
    };
  };
});
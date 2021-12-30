define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class ExceptionWokringWindowModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  const ExceptionWokringWindowModel = function() {
    const
      baseService = BaseService.getInstance();
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let
      createExceptionDeferred;
    const createException = function(model, deferred) {
      const options = {
        url: "workingWindows",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateExceptionDeferred;
    const updateException = function(workingWindowId, model, deferred) {
      const params = {
          workingWindowId: workingWindowId
        },
        options = {
          url: "workingWindows/{workingWindowId}",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

      baseService.update(options, params);
    };
    let fetchUserTypeDeferred;
    const fetchUserType = function(deferred) {
      const
        options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let deleteExceptionDeferred;
    const deleteException = function(workingWindowId, deferred) {
      const params = {
          workingWindowId: workingWindowId
        },
        options = {
          url: "workingWindows/{workingWindowId}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.remove(options, params);
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

    return {
      createException: function(model) {
        createExceptionDeferred = $.Deferred();
        createException(model, createExceptionDeferred);

        return createExceptionDeferred;
      },
      updateException: function(workingWindowId, model) {
        updateExceptionDeferred = $.Deferred();
        updateException(workingWindowId, model, updateExceptionDeferred);

        return updateExceptionDeferred;
      },
      deleteException: function(workingWindowId) {
        deleteExceptionDeferred = $.Deferred();
        deleteException(workingWindowId, deleteExceptionDeferred);

        return deleteExceptionDeferred;
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

  return new ExceptionWokringWindowModel();
});
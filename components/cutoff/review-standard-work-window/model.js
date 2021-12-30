define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class BankLookUpModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  const UserGroupModel = function() {
    const
      baseService = BaseService.getInstance(),
      Model = function() {
        this.WorkingWindow = {
          remarks: null,
          exceptionCode: null,
          effectiveDate: null,
          workingWindowType: "STANDARD",
          processingType: null,
          workingWindowRoleTaskMapDTOs: []
        };
      };
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let createStandardWorkWindowDeferred;
    const createStandardWorkWindow = function(standardWorkWindowCreatePayload, deferred) {
      const options = {
        url: "workingWindows",
        data: standardWorkWindowCreatePayload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
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
    let editStandardWorkWindowDeferred;
    const editStandardWorkWindow = function(workingWindowId, standardWorkWindowEditPayload, deferred) {
      const options = {
        url: "workingWindows/" + workingWindowId,
        data: standardWorkWindowEditPayload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };
    let fetchTaskNameDeferred;
    const fetchTaskName = function(taskId, deferred) {
      const options = {
        url: "resourceTasks/" + taskId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let readWWDeferred;
    const readWW = function(workingWindowId, deferred) {
      const options = {
        url: "workingWindows/" + workingWindowId,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      createStandardWorkWindow: function(standardWorkWindowCreatePayload) {
        createStandardWorkWindowDeferred = $.Deferred();
        createStandardWorkWindow(standardWorkWindowCreatePayload, createStandardWorkWindowDeferred);

        return createStandardWorkWindowDeferred;
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
      },
      editStandardWorkWindow: function(workingWindowId, standardWorkWindowEditPayload) {
        editStandardWorkWindowDeferred = $.Deferred();
        editStandardWorkWindow(workingWindowId, standardWorkWindowEditPayload, editStandardWorkWindowDeferred);

        return editStandardWorkWindowDeferred;
      },
      readWW: function(workingWindowId) {
        readWWDeferred = $.Deferred();
        readWW(workingWindowId, readWWDeferred);

        return readWWDeferred;
      }
    };
  };

  return new UserGroupModel();
});
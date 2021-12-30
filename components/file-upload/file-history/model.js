define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const fileHistoryModel = function () {
    const
      baseService = BaseService.getInstance();
    let getFileDeferred;
    const getFile = function (deferred, fileRefId) {
      const options = {
          url: "fileUploads/files/{fileRefId}/responsefile",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId
        };

      baseService.downloadFile(options, params);
    };
    let getErrorFileDeferred;
    const getErrorFile = function (deferred, fileRefId) {
      const options = {
          url: "fileUploads/files/{fileRefId}/responsefile?fileType=error",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId
        };

      baseService.downloadFile(options, params);
    };
    let getResponseFileDeferrred;
    const getResponseFile = function (deferred, fileRefId) {
      const options = {
          url: "fileUploads/files/{fileRefId}/responsefile?fileType=response",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId
        };

      baseService.downloadFile(options, params);
    };
    let getRecordCountWithStatusDeferred;
    const getRecordCountWithStatus = function (deferred, fileRefId) {
      const options = {
          url: "fileUploads/files/{fileRefId}/recordStatusCount",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId
        };

      baseService.fetch(options, params);
    };
    let getFileWorkFlowStagesDeferred;
    const getFileWorkFlowStages = function (deferred) {
      const options = {
        url: "enumerations/fileWorkFlowStages",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getFile: function (fileRefId) {
        getFileDeferred = $.Deferred();
        getFile(getFileDeferred, fileRefId);

        return getFileDeferred;
      },
      getErrorFile: function (fileRefId) {
        getErrorFileDeferred = $.Deferred();
        getErrorFile(getErrorFileDeferred, fileRefId);

        return getErrorFileDeferred;
      },
      getResponseFile: function (fileRefId) {
        getResponseFileDeferrred = $.Deferred();
        getResponseFile(getResponseFileDeferrred, fileRefId);

        return getResponseFileDeferrred;
      },
      getRecordCountWithStatus: function (fileRefId) {
        getRecordCountWithStatusDeferred = $.Deferred();
        getRecordCountWithStatus(getRecordCountWithStatusDeferred, fileRefId);

        return getRecordCountWithStatusDeferred;
      },
      getFileWorkFlowStages: function () {
        getFileWorkFlowStagesDeferred = $.Deferred();
        getFileWorkFlowStages(getFileWorkFlowStagesDeferred);

        return getFileWorkFlowStagesDeferred;
      }
    };
  };

  return new fileHistoryModel();
});
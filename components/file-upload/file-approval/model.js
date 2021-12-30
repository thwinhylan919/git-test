define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const fileApprovalModel = function() {
    const baseService = BaseService.getInstance();
    let getFileStatusDeferred;
    const getFileStatus = function(deferred) {
      const options = {
        url: "enumerations/fileStatuses",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listFilesDeferred;
    const listFiles = function(deferred, fileRefId) {
      const options = {
          url: "fileUploads/files?fileId={fileRefId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId
        };

      baseService.fetch(options, params);
    };

    return {
      getFileStatus: function() {
        getFileStatusDeferred = $.Deferred();
        getFileStatus(getFileStatusDeferred);

        return getFileStatusDeferred;
      },
      listFiles: function(fileRefId) {
        listFilesDeferred = $.Deferred();
        listFiles(listFilesDeferred, fileRefId);

        return listFilesDeferred;
      }
    };
  };

  return new fileApprovalModel();
});
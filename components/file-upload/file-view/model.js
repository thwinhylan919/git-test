define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const fileViewModel = function() {
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
    let listFileIdentifiersDeferred;
    const listFileIdentifiers = function(deferred) {
      const options = {
        url: "fileUploads/userFileIdentifiersMappings",
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
    const listFiles = function(deferred, PARAMS) {
      const options = {
        url: PARAMS,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getPaymentTypesDeferred;
    const getPaymentTypes = function(deferred) {
      const options = {
        url: "enumerations/transactionTypes",
        success: function(result, status, xhr) {
          deferred.resolve(result, status, xhr);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let deleteFileDeferred;
    const deleteFile = function(deferred, fileRefId) {
      const options = {
          url: "fileUploads/files/{fileRefId}",
          success: function(result, status, xhr) {
            deferred.resolve(result, status, xhr);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId
        };

      baseService.remove(options, params);
    };

    return {
      getFileStatus: function() {
        getFileStatusDeferred = $.Deferred();
        getFileStatus(getFileStatusDeferred);

        return getFileStatusDeferred;
      },
      listFiles: function(PARAMS) {
        listFilesDeferred = $.Deferred();
        listFiles(listFilesDeferred, PARAMS);

        return listFilesDeferred;
      },
      listFileIdentifiers: function() {
        listFileIdentifiersDeferred = $.Deferred();
        listFileIdentifiers(listFileIdentifiersDeferred);

        return listFileIdentifiersDeferred;
      },
      getPaymentTypes: function() {
        getPaymentTypesDeferred = $.Deferred();
        getPaymentTypes(getPaymentTypesDeferred);

        return getPaymentTypesDeferred;
      },
      deleteFile: function(fileRefId) {
        deleteFileDeferred = $.Deferred();
        deleteFile(deleteFileDeferred, fileRefId);

        return deleteFileDeferred;
      }
    };
  };

  return new fileViewModel();
});
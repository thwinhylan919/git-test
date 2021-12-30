define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const recordViewModel = function () {
    const
      baseService = BaseService.getInstance();
    let readRecordDeferred;
    const readRecord = function (deferred, fileRefId, recRefId) {
      const options = {
        url: "fileUploads/files/{fileRefId}/records/{recRefId}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          fileRefId: fileRefId,
          recRefId: recRefId
        };

      baseService.fetch(options, params);
    };
    let getRecordStatusDeferred;
    const getRecordStatus = function (deferred) {
      const options = {
        url: "enumerations/recordStatuses",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let deleteRecordsDeferred;
    const deleteRecords = function (deferred, fileRefId, recordRefId) {
      const options = {
        url: "fileUploads/files/{fileRefId}/records/{recordRefId}",
        success: function (result, status, xhr) {
          deferred.resolve(result, status, xhr);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          fileRefId: fileRefId,
          recordRefId: recordRefId
        };

      baseService.remove(options, params);
    };

    return {
      readRecord: function (fileRefId, recRefId) {
        readRecordDeferred = $.Deferred();
        readRecord(readRecordDeferred, fileRefId, recRefId);

        return readRecordDeferred;
      },
      getRecordStatus: function () {
        getRecordStatusDeferred = $.Deferred();
        getRecordStatus(getRecordStatusDeferred);

        return getRecordStatusDeferred;
      },
      deleteRecords: function (fileRefId, recordRefId) {
        deleteRecordsDeferred = $.Deferred();
        deleteRecords(deleteRecordsDeferred, fileRefId, recordRefId);

        return deleteRecordsDeferred;
      }
    };
  };

  return new recordViewModel();
});
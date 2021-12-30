define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const recordListNonFinacialModel = function() {
    const baseService = BaseService.getInstance();
    let getAccountTypesDeferred;
    const getAccountTypes = function(deferred) {
      const options = {
        url: "enumerations/accountTypes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getPayeeTypesDeferred;
    const getPayeeTypes = function(deferred) {
      const options = {
        url: "enumerations/payeeTypes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getRecordStatusDeferred;
    const getRecordStatus = function(deferred) {
      const options = {
        url: "enumerations/recordStatuses",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listRecordsDeferred;
    const listRecords = function(deferred, PARAMS) {
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

    return {
      getAccountTypes: function() {
        getAccountTypesDeferred = $.Deferred();
        getAccountTypes(getAccountTypesDeferred);

        return getAccountTypesDeferred;
      },
      listRecords: function(PARAMS) {
        listRecordsDeferred = $.Deferred();
        listRecords(listRecordsDeferred, PARAMS);

        return listRecordsDeferred;
      },
      getRecordStatus: function() {
        getRecordStatusDeferred = $.Deferred();
        getRecordStatus(getRecordStatusDeferred);

        return getRecordStatusDeferred;
      },
      getPayeeTypes: function() {
        getPayeeTypesDeferred = $.Deferred();
        getPayeeTypes(getPayeeTypesDeferred);

        return getPayeeTypesDeferred;
      }
    };
  };

  return new recordListNonFinacialModel();
});
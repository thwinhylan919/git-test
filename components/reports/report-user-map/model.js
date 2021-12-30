define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const reportUserMapModel = function () {
    const Model = function () {
      this.ReportUserMapPaylaod = {
        userId: null,
        partyId: null,
        reportIdentifers: []
      };
    },
      baseService = BaseService.getInstance();
    let listMappedReportsDeferred;
    const listMappedReports = function (deferred, userId) {
      const options = {
        url: "reports/reportMapping/users/{userId}/mappings",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          userId: userId
        };

      baseService.fetch(options, params);
    };
    let listAllReportsDeferred;
    const listAllReports = function (deferred, url) {
      const options = {
        url: url,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let updateMapDeferred;
    const updateMap = function (deferred, payload) {
      const options = {
        url: "reports/reportMapping",
        data: payload,
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };

    return {
      getNewModel: function (dataModel) {
        return new Model(dataModel);
      },
      listMappedReports: function (userId) {
        listMappedReportsDeferred = $.Deferred();
        listMappedReports(listMappedReportsDeferred, userId);

        return listMappedReportsDeferred;
      },
      listAllReports: function (url) {
        listAllReportsDeferred = $.Deferred();
        listAllReports(listAllReportsDeferred, url);

        return listAllReportsDeferred;
      },
      updateMap: function (model) {
        updateMapDeferred = $.Deferred();
        updateMap(updateMapDeferred, model);

        return updateMapDeferred;
      }
    };
  };

  return new reportUserMapModel();
});
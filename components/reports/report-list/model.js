define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const reportListModel = function () {
    const
      baseService = BaseService.getInstance();
    let getReportTypesDeferred;
    const getReportTypes = function (deferred, userType) {
      let options;

      if (userType === "CORP") {
        options = {
          url: "reports/reportDefinition/userReports",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
      } else {
        options = {
          url: "reports/reportDefinition/adminReports",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
      }

      baseService.fetch(options);
    };
    let getReportFrequencyTypesDeferred;
    const getReportFrequencyTypes = function (deferred) {
      const options = {
        url: "enumerations/reportFrequencyTypes",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let downloadReportDeferred;
    const downloadReport = function (deferred, reportRequestId) {
      const options = {
        url: "reports/reportProcessHistory/{reportRequestId}",
        success: function (data) {
          deferred.resolve(data);
        }

      },
        params = {
          reportRequestId: reportRequestId
        };

      baseService.downloadFile(options, params);
    };
    let listReportHistoryDeferred;
    const listReportHistory = function (deferred, URL) {
      const options = {
        url: URL,
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
      getReportTypes: function (userType) {
        getReportTypesDeferred = $.Deferred();
        getReportTypes(getReportTypesDeferred, userType);

        return getReportTypesDeferred;
      },
      listReportHistory: function (url) {
        listReportHistoryDeferred = $.Deferred();
        listReportHistory(listReportHistoryDeferred, url);

        return listReportHistoryDeferred;
      },
      getReportFrequencyTypes: function () {
        getReportFrequencyTypesDeferred = $.Deferred();
        getReportFrequencyTypes(getReportFrequencyTypesDeferred);

        return getReportFrequencyTypesDeferred;
      },
      downloadReport: function (reportReqId) {
        downloadReportDeferred = $.Deferred();
        downloadReport(downloadReportDeferred, reportReqId);

        return downloadReportDeferred;
      }
    };
  };

  return new reportListModel();
});
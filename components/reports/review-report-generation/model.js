define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const fuidViewModel = function () {
    const baseService = BaseService.getInstance();
    let getReportDataDeferred;
    const getReportData = function (deferred, reportRequestId) {
      const params = {
        reportRequestId: reportRequestId
      },
      options = {
        url: "reports/reportRequest/{reportRequestId}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options,params);
    };
    let getReportFrequencyTypesDeferred;
    const getReportFrequencyTypes = function (deferred) {
      const options = {
        url: "enumerations/reportFrequencyTypes",
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let fetchParamsComponentDeferred;
    const fetchParamsComponent = function (deferred) {
      const options = {
        url: "reports/paramsComponent",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetchJSON(options);
    };
    let fetchReportDetailsDeferred;
    const fetchReportDetails = function (url, deferred) {
      const options = {
        url: url,
        success: function (data) {
          deferred.resolve(data);
        },
        failure: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getReportData: function (reportRequestId) {
        getReportDataDeferred = $.Deferred();
        getReportData(getReportDataDeferred, reportRequestId);

        return getReportDataDeferred;
      },
      getReportFrequencyTypes: function () {
        getReportFrequencyTypesDeferred = $.Deferred();
        getReportFrequencyTypes(getReportFrequencyTypesDeferred);

        return getReportFrequencyTypesDeferred;
      },
      fetchReportDetails: function (url) {
        fetchReportDetailsDeferred = $.Deferred();
        fetchReportDetails(url, fetchReportDetailsDeferred);

        return fetchReportDetailsDeferred;
      },
      fetchParamsComponent: function (reportReqId) {
        fetchParamsComponentDeferred = $.Deferred();
        fetchParamsComponent(fetchParamsComponentDeferred, reportReqId);

        return fetchParamsComponentDeferred;
      }
    };
  };

  return new fuidViewModel();
});
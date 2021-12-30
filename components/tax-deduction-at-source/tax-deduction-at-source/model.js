define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const tdsModel = function() {
    const baseService = BaseService.getInstance();
    let downloadDeferred;
    /**
     * Download - description.
     *
     * @param  {type} taskCode  - - - - - - - - - - - - - - Description.
     * @param  {type} fromDate  Description.
     * @param  {type} toDate    Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const download = function(taskCode, fromDate, toDate, deferred) {
      const parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/deposit/taxPaid?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.downloadFile(options, parameters);
    };
    let viewDeferred;
    /**
     * View - description.
     *
     * @param  {type} deferred - - - - - - - - - - - - - - Description.
     * @param  {type} taskCode Description.
     * @param  {type} fromDate Description.
     * @param  {type} toDate   Description.
     * @return {type}          Description.
     */
    const view = function(deferred, taskCode, fromDate, toDate) {
      const parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/deposit/taxPaid?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, parameters);
    };
    let fetchCurrentDateDeferred;
    /**
     * FetchCurrentDate - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchCurrentDate = function(deferred) {
      const options = {
        url: "payments/currentDate",
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
      /**
       * Download - description.
       *
       * @param  {type} taskCode  - - - - - - - - - - - - - - - Description.
       * @param  {type} fromDate  Description.
       * @param  {type} toDate    Description.
       * @return {type}           Description.
       */
      download: function(taskCode, fromDate, toDate) {
        downloadDeferred = $.Deferred();
        download(taskCode, fromDate, toDate, downloadDeferred);

        return downloadDeferred;
      },
      /**
       * View - description.
       *
       * @param  {type} taskCode  - - - - - - - - - - - - - - - Description.
       * @param  {type} fromDate    Description.
       * @param  {type} toDate    Description.
       * @return {type}           Description.
       */
      view: function(taskCode, fromDate, toDate) {
        viewDeferred = $.Deferred();
        view(viewDeferred, taskCode, fromDate, toDate);

        return viewDeferred;
      },
      /**
       * FetchCurrentDate - description.
       *
       * @return {type}  Description.
       */
      fetchCurrentDate: function() {
        fetchCurrentDateDeferred = $.Deferred();
        fetchCurrentDate(fetchCurrentDateDeferred);

        return fetchCurrentDateDeferred;
      }
    };
  };

  return new tdsModel();
});
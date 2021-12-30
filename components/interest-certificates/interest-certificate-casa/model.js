define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for Demand Deposit account interest section in the interest certificate page. It serves as the model where the data to be used by the demand deposit account interest section is defined.
   *
   * @namespace DDAModel~Model
   * @class DDAModel
   */
  const DDAModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let fetchDDAInterestsDeferred;
    /**
     * Private method to get demand deposit interests to be displayed on interest certificate page.
     * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchDDAInterests
     * @memberOf DDAModel
     * @param {string} fromDate - From date.
     * @param {string} toDate - To date.
     * @param {string} accountId - AccountId.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchDDAInterests = function(fromDate, toDate, accountId, deferred) {
      const parameters = {
          accountId: accountId,
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/demandDeposit/{accountId}/interest?fromDate={fromDate}&toDate={toDate}&taskCode=CH_I_IC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, parameters);
    };
    let fetchDDAInterestsForAllDeferred;
    /**
     * Private method to get demand deposit interests to be displayed on interest certificate page.
     * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchDDAInterestsForAll
     * @memberOf DDAModel
     * @param {string} fromDate - From date.
     * @param {string} toDate - To date.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchDDAInterestsForAll = function(fromDate, toDate, deferred) {
      const parameters = {
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/demandDeposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=CH_I_IC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, parameters);
    };
    let fetchPDFDeferred;
    /**
     * FetchPDF - description.
     *
     * @param  {type} accountNo - - - - - - - - - - - - - - Description.
     * @param  {type} fromDate  Description.
     * @param  {type} toDate    Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const fetchPDF = function(accountNo, fromDate, toDate, deferred) {
      const parameters = {
          accountNo: accountNo,
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/demandDeposit/{accountNo}/interest?fromDate={fromDate}&toDate={toDate}&taskCode=CH_I_IC&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.downloadFile(options, parameters);
    };
    let fetchPDFForAllDeferred;
    /**
     * FetchPDFForAll - description.
     *
     * @param  {type} fromDate  - - - - - - - - - - - - - - - Description.
     * @param  {type} toDate    Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const fetchPDFForAll = function(fromDate, toDate, deferred) {
      const parameters = {
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/demandDeposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=CH_I_IC&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.downloadFile(options, parameters);
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
       * Private method to get demand deposit interests to be displayed on interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDDAInterests
       * @memberOf DDAModel
       * @param {string} fromDate - From date.
       * @param {string} toDate - To date.
       * @param {string} accountId - AccountId.
       * @return {type}          Description.
       * @example
       * DDAModel.fetchDDAInterests().then(function (data) {
       *
       * });
       */
      fetchDDAInterests: function(fromDate, toDate, accountId) {
        fetchDDAInterestsDeferred = $.Deferred();
        fetchDDAInterests(fromDate, toDate, accountId, fetchDDAInterestsDeferred);

        return fetchDDAInterestsDeferred;
      },
      /**
       * Private method to get demand deposit interests to be displayed on interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDDAInterestsForAll
       * @memberOf DDAModel
       * @param {string} fromDate - From date.
       * @param {string} toDate - To date.
       * @return {type}          Description.
       * @example
       * DDAModel.fetchDDAInterestsForAll().then(function (data) {
       *
       * });
       */
      fetchDDAInterestsForAll: function(fromDate, toDate) {
        fetchDDAInterestsForAllDeferred = $.Deferred();
        fetchDDAInterestsForAll(fromDate, toDate, fetchDDAInterestsForAllDeferred);

        return fetchDDAInterestsForAllDeferred;
      },
      /**
       * FetchPDF - description.
       *
       * @param  {type} accountNo - - - - - - - - - - - - - - - Description.
       * @param  {type} fromDate  Description.
       * @param  {type} toDate    Description.
       * @return {type}           Description.
       */
      fetchPDF: function(accountNo, fromDate, toDate) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(accountNo, fromDate, toDate, fetchPDFDeferred);

        return fetchPDFDeferred;
      },
      /**
       * FetchPDFForAll - description.
       *
       * @param  {type} fromDate  - - - - - - - - - - - - - - - - Description.
       * @param  {type} toDate    Description.
       * @return {type}           Description.
       */
      fetchPDFForAll: function(fromDate, toDate) {
        fetchPDFForAllDeferred = $.Deferred();
        fetchPDFForAll(fromDate, toDate, fetchPDFForAllDeferred);

        return fetchPDFForAllDeferred;
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

  return new DDAModel();
});
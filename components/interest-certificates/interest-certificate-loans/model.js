define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for loan account interest section in the interest certificate page. It serves as the model where the data to be used by the loan account interest section is defined.
   *
   * @namespace loansModel~Model
   * @class loansModel
   */
  const loansModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let fetchLoanInterestsDeferred;
    /**
     * Private method to get loan interests to be displayed on loan interest certificate page.
     * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchLoanInterests
     * @memberOf loansModel
     * @param {string} accountId - Account Id.
     * @param {string} fromDate - From date.
     * @param {string} toDate - To date.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchLoanInterests = function(accountId, fromDate, toDate, deferred) {
      const parameters = {
          accountId: accountId,
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/loan/{accountId}/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=LN_I_IC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, parameters);
    };
    let fetchLoanInterestsForAllDeferred;
    /**
     * Private method to get loan interests to be displayed on loan interest certificate page.
     * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchLoanInterestsForAll
     * @memberOf loansModel
     * @param {string} fromDate - From date.
     * @param {string} toDate - To date.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchLoanInterestsForAll = function(fromDate, toDate, deferred) {
      const parameters = {
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/loan/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=LN_I_IC",
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
          url: "accounts/loan/{accountNo}/paidInterest?fromDate={fromDate}&toDate={toDate}&media=application/pdf&taskCode=LN_I_IC",
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
          url: "accounts/loan/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=LN_I_IC&media=application/pdf",
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
       * Private method to get loan interests to be displayed on loan interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchLoanInterests
       * @memberOf loansModel
       * @param {string} accountId -Account Id.
       * @param {string} fromDate - From date.
       * @param {string} toDate - To date.
       * @return {type}          Description.
       * @example
       * loansModel.fetchLoanInterests().then(function (data) {
       *
       * });
       */
      fetchLoanInterests: function(accountId, fromDate, toDate) {
        fetchLoanInterestsDeferred = $.Deferred();
        fetchLoanInterests(accountId, fromDate, toDate, fetchLoanInterestsDeferred);

        return fetchLoanInterestsDeferred;
      },
      /**
       * Private method to get loan interests to be displayed on loan interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchLoanInterestsForAll
       * @memberOf loansModel
       * @param {string} fromDate - From date.
       * @param {string} toDate - To date.
       * @return {type}          Description.
       * @example
       * loansModel.fetchLoanInterestsForAll().then(function (data) {
       *
       * });
       */
      fetchLoanInterestsForAll: function(fromDate, toDate) {
        fetchLoanInterestsForAllDeferred = $.Deferred();
        fetchLoanInterestsForAll(fromDate, toDate, fetchLoanInterestsForAllDeferred);

        return fetchLoanInterestsForAllDeferred;
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

  return new loansModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for deposit account interest section in the interest certificate page. It serves as the model where the data to be used by the deposit account interest section is defined.
   *
   * @namespace depositModel~Model
   * @class depositModel
   */
  const depositModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let fetchDepositInterestsDeferred;
    /**
     * Private method to get deposit interests to be displayed on deposit interest certificate page.
     * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchDepositInterests
     * @memberOf depositModel
     * @param {string} accountId - Account Id.
     * @param {string} fromDate - From date.
     * @param {string} toDate - To date.
     * @param {string} depositmodule - Deposit module.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchDepositInterests = function(accountId, fromDate, toDate, depositmodule, deferred) {
      const parameters = {
          accountId: accountId,
          fromDate: fromDate,
          toDate: toDate,
          depositmodule: depositmodule
        },
        options = {
          url: "accounts/deposit/{accountId}/paidInterest?fromDate={fromDate}&toDate={toDate}&module={depositmodule}&taskCode=TD_I_IC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, parameters);
    };
    let fetchRDInterestsForAllDeferred;
    /**
     * Private method to get deposit interests to be displayed on deposit interest certificate page.
     * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchRDInterestsForAll
     * @memberOf depositModel
     * @param {string} fromDate - From date.
     * @param {string} toDate - To date.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchRDInterestsForAll = function(fromDate, toDate, deferred) {
      const parameters = {
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=TD_I_IC&module=RD",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, parameters);
    };
    let fetchDepositInterestsForAllDeferred;
    /**
     * Private method to get deposit interests to be displayed on deposit interest certificate page.
     * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchDepositInterestsForAll
     * @memberOf depositModel
     * @param {string} fromDate - From date.
     * @param {string} toDate - To date.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchDepositInterestsForAll = function(fromDate, toDate, deferred) {
      const parameters = {
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=TD_I_IC&module=CON&module=ISL",
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
     * @param  {type} accountNo     - - - - - - - - - - - - - Description.
     * @param  {type} fromDate      Description.
     * @param  {type} toDate        Description.
     * @param  {type} depositmodule Description.
     * @param  {type} deferred      Description.
     * @return {type}               Description.
     */
    const fetchPDF = function(accountNo, fromDate, toDate, depositmodule, deferred) {
      const parameters = {
          accountNo: accountNo,
          fromDate: fromDate,
          toDate: toDate,
          module: depositmodule
        },
        options = {
          url: "accounts/deposit/{accountNo}/paidInterest?fromDate={fromDate}&toDate={toDate}&module={module}&taskCode=TD_I_IC&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.downloadFile(options, parameters);
    };
    let fetchRDPDFForAllDeferred;
    /**
     * FetchRDPDFForAll - description.
     *
     * @param  {type} fromDate  - - - - - - - - - - - - - - - Description.
     * @param  {type} toDate    Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const fetchRDPDFForAll = function(fromDate, toDate, deferred) {
      const parameters = {
          fromDate: fromDate,
          toDate: toDate
        },
        options = {
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=TD_I_IC&media=application/pdf&module=RD",
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
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode=TD_I_IC&media=application/pdf&module=CON&module=ISL",
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
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDepositInterests
       * @memberOf depositModel
       * @param {string} accountId - Account Id.
       * @param {string} fromDate - From date.
       * @param {string} toDate - To date.
       * @param {string} depositmodule - Deposit module.
       * @return {type}          Description.
       * @example
       * depositModel.fetchDepositInterests().then(function (data) {
       *
       * });
       */
      fetchDepositInterests: function(accountId, fromDate, toDate, depositmodule) {
        fetchDepositInterestsDeferred = $.Deferred();
        fetchDepositInterests(accountId, fromDate, toDate, depositmodule, fetchDepositInterestsDeferred);

        return fetchDepositInterestsDeferred;
      },
      /**
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDepositInterestsForAll
       * @memberOf depositModel
       * @param {string} fromDate - From date.
       * @param {string} toDate - To date.
       * @return {type}          Description.
       * @example
       * depositModel.fetchDepositInterestsForAll().then(function (data) {
       *
       * });
       */
      fetchDepositInterestsForAll: function(fromDate, toDate) {
        fetchDepositInterestsForAllDeferred = $.Deferred();
        fetchDepositInterestsForAll(fromDate, toDate, fetchDepositInterestsForAllDeferred);

        return fetchDepositInterestsForAllDeferred;
      },
      /**
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchRDInterestsForAll
       * @memberOf depositModel
       * @param {string} fromDate - From date.
       * @param {string} toDate - To date.
       * @return {type}          Description.
       * @example
       * depositModel.fetchDepositInterestsForAll().then(function (data) {
       *
       * });
       */
      fetchRDInterestsForAll: function(fromDate, toDate) {
        fetchRDInterestsForAllDeferred = $.Deferred();
        fetchRDInterestsForAll(fromDate, toDate, fetchRDInterestsForAllDeferred);

        return fetchRDInterestsForAllDeferred;
      },
      /**
       * FetchPDF - description.
       *
       * @param  {type} accountNo     - - - - - - - - - - - - - - Description.
       * @param  {type} fromDate      Description.
       * @param  {type} toDate        Description.
       * @param  {type} depositmodule Description.
       * @return {type}               Description.
       */
      fetchPDF: function(accountNo, fromDate, toDate, depositmodule) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(accountNo, fromDate, toDate, depositmodule, fetchPDFDeferred);

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
       * FetchRDPDFForAll - description.
       *
       * @param  {type} fromDate  - - - - - - - - - - - - - - - - Description.
       * @param  {type} toDate    Description.
       * @return {type}           Description.
       */
      fetchRDPDFForAll: function(fromDate, toDate) {
        fetchRDPDFForAllDeferred = $.Deferred();
        fetchRDPDFForAll(fromDate, toDate, fetchRDPDFForAllDeferred);

        return fetchRDPDFForAllDeferred;
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

  return new depositModel();
});
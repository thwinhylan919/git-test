define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Create Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsCreateModel
   */
  const OrderStatusModel = function() {
    const baseService = BaseService.getInstance();

    let investmentAccountDeferred;

    /**
     * Private method to create a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchInvestmentAccounts
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchInvestmentAccounts = function(deferred) {
      const options = {
        url: "accounts/investmentAccounts",
        success: function(status, jqXhr) {
          deferred.resolve(status, jqXhr);
        },
        error: function(status, jqXhr) {
          deferred.reject(status, jqXhr);
        }
      };

      baseService.fetch(options);
    };

    let fundHousesDeferred;

    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchFundHouse
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchAllFundHouse = function(deferred) {
      const
        options = {
          url: "fundHouses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };

    let fundHouseDeferred;

    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchFundHouse
     * @memberOf ErrorModel
     * @param {String} investmentAccountId - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchFundHouse = function(investmentAccountId, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/holdings",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccountId
        };

      baseService.fetch(options, params);
    };

    let orderTypesDeffered;
    const fetchMFOrderTypes = function(deferred) {
      const options = {
        url: "enumerations/mfOrderTypes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    let orderStatusDeffered;
    const fetchMFOrderStatus = function(deferred) {
      const options = {
        url: "enumerations/mfOrderStatus",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    let schemeNameDeferred;

    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchSchemeName
     * @memberOf ErrorModel
     * @param {String} investmentAccountId - An object type String
     * @param {String} fundHouseCode - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchSchemeName = function(investmentAccountId, fundHouseCode, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/holdings?fundhouseCode={fundHouseCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccountId,
          fundHouseCode: fundHouseCode
        };

      baseService.fetch(options, params);
    };

    let orderStatusReportDeferred;

    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchOrderStatusReport
     * @memberOf ErrorModel
     * @param {String} investmentAccount - payload to pass
     * @param {String} fundHouseCode - An object type String
     * @param {String} schemeCode -  An object type String
     * @param {String} orderType - An object type String
     * @param {String} referenceNo - An object type String
     * @param {Date} fromDate - An object type Date
     * @param {Date} toDate - An object type Date
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchOrderStatusReport = function(investmentAccount, fundHouseCode, schemeCode, orderType, referenceNo, fromDate, toDate, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/instructions?fundHouseCode={fundHouseCode}&schemeCode={schemeCode}&orderType={orderType}&referenceNo={referenceNo}&fromDate={fromDate}&toDate={toDate}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccount,
          fundHouseCode: fundHouseCode,
          schemeCode: schemeCode,
          orderType: orderType,
          referenceNo: referenceNo,
          fromDate: fromDate,
          toDate: toDate
        };

      baseService.fetch(options, params);
    };

    let fetchPDFDeferred;
    /**
     * Private method to fetch pdf report.
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchPDF
     * @memberOf ErrorModel
     * @param {String} investmentAccount - payload to pass
     * @param {String} fundHouseCode - An object type String
     * @param {String} schemeCode -  An object type String
     * @param {String} orderType - An object type String
     * @param {String} referenceNo - An object type String
     * @param {Date} fromDate - An object type Date
     * @param {Date} toDate - An object type Date
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */

    const fetchPDF = function(investmentAccount, fundHouseCode, schemeCode, orderType, referenceNo, fromDate, toDate, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/instructions?fundHouseCode={fundHouseCode}&schemeCode={schemeCode}&orderType={orderType}&referenceNo={referenceNo}&fromDate={fromDate}&toDate={toDate}&media=application/pdf&mediaFormat=pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          investmentAccountId: investmentAccount,
          fundHouseCode: fundHouseCode,
          schemeCode: schemeCode,
          orderType: orderType,
          referenceNo: referenceNo,
          fromDate: fromDate,
          toDate: toDate
        };

      baseService.downloadFile(options, params);
    };
    let fetchOrderDeferred;

    /**
     * Private method to fetch the order details.
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchOrder
     * @memberOf ErrorModel
     * @param {string} investmentAccount - Payload to pass.
     * @param {string} instructionId - An object type String.
     * @param {Object} deferred - An object type deferred.
     * @returns {void}
     * @private
     */
    const fetchOrder = function(investmentAccount, instructionId, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/instructions/{instructionId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountId: investmentAccount,
          instructionId: instructionId
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentAccounts
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.fetchInvestmentAccounts().done(function(data) {
       *
       *       });
       */
      fetchInvestmentAccounts: function() {
        investmentAccountDeferred = $.Deferred();
        fetchInvestmentAccounts(investmentAccountDeferred);

        return investmentAccountDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFundHouse
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.fetchFundHouse().done(function(data) {
       *
       *       });
       */
      fetchFundHouse: function(investmentAccountId) {
        fundHouseDeferred = $.Deferred();
        fetchFundHouse(investmentAccountId, fundHouseDeferred);

        return fundHouseDeferred;
      },

      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchAllFundHouse
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       DividendReportsModel.fetchAllFundHouse().done(function(data) {
       *
       *       });
       */
      fetchAllFundHouse: function() {
        fundHousesDeferred = $.Deferred();
        fetchAllFundHouse(fundHousesDeferred);

        return fundHousesDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchMFOrderTypes
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.fetchMFOrderTypes().done(function(data) {
       *
       *       });
       */
      fetchMFOrderTypes: function() {
        orderTypesDeffered = $.Deferred();
        fetchMFOrderTypes(orderTypesDeffered);

        return orderTypesDeffered;
      },
      /**
       * Public method to fetch list of Order statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchMFOrderStatus
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.fetchMFOrderStatus().done(function(data) {
       *
       *       });
       */
      fetchMFOrderStatus: function() {
        orderStatusDeffered = $.Deferred();
        fetchMFOrderStatus(orderStatusDeffered);

        return orderStatusDeffered;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchOrderStatusReport
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {string} fundHouseCode - An object type String.
       * @param {string} schemeCode -  An object type String.
       * @param {string} orderType - An object type String.
       * @param {string} referenceNo - An object type String.
       * @param {Date} fromDate - An object type Date.
       * @param {Date} toDate - An object type Date.
       * @param {Object} deferred - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.fetchMFOrderTypes().done(function(data) {
       *
       *       });
       */
      fetchOrderStatusReport: function(investmentAccountId, fundHouseCode, schemeCode, orderType, referenceNo, fromDate, toDate) {
        orderStatusReportDeferred = $.Deferred();
        fetchOrderStatusReport(investmentAccountId, fundHouseCode, schemeCode, orderType, referenceNo, fromDate, toDate, orderStatusReportDeferred);

        return orderStatusReportDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchPDF
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {string} fundHouseCode - An object type String.
       * @param {string} schemeCode -  An object type String.
       * @param {string} orderType - An object type String.
       * @param {string} referenceNo - An object type String.
       * @param {Date} fromDate - An object type Date.
       * @param {Date} toDate - An object type Date.
       * @param {Object} deferred - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.fetchPDF().done(function(data) {
       *
       *       });
       */
      fetchPDF: function(investmentAccountId, fundHouseCode, schemeCode, orderType, referenceNo, fromDate, toDate) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(investmentAccountId, fundHouseCode, schemeCode, orderType, referenceNo, fromDate, toDate, fetchPDFDeferred);

        return fetchPDFDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchOrder
       * @memberOf PurchaseMutualFundModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {string} instructionId - An object type String.
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.fetchOrder().done(function(data) {
       *
       *       });
       */
      fetchOrder: function(investmentAccountId, instructionId) {
        fetchOrderDeferred = $.Deferred();
        fetchOrder(investmentAccountId, instructionId, fetchOrderDeferred);

        return fetchOrderDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemeName
       * @memberOf OrderStatusModel
       * @param {string} investmentAccountId - Payload to pass.
       * @param {string} fundHouseCode - For request to be updated.
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.fetchSchemeName(fundHouseCode).done(function(data) {
       *
       *       });
       */
      fetchSchemeName: function(investmentAccountId, fundHouseCode) {
        schemeNameDeferred = $.Deferred();
        fetchSchemeName(investmentAccountId, fundHouseCode, schemeNameDeferred);

        return schemeNameDeferred;
      }
    };
  };

  return new OrderStatusModel();
});

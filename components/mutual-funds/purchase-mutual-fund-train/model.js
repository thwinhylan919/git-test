define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request global Model<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsGlobalModel
   */
  const ServiceRequestsGlobalModel = function() {
    const getData = function() {
        const model = {
          purchaseFund: {
            fundHouseCode: null,
            investmentAccountNumber: null,
            casaAccountNumber: null,
            recurring: false,
            transactionTypeCode: "PURCHASE",
            instructionTypeCode: "ONE_TIME",
            scheme: {
              schemeCode: null,
              schemeName: null,
              fundCategory: {
                fundCategoryCode: null,
                fundCategoryDesc: null
              }
            },
            folioNumber: null,
            dividendActionCode: "REINVEST",
            scheduledDate: null,
            startDate: null,
            frequency: null,
            installments: null,
            endDate: null,
            txnAmount: {
              amount: "",
              currency: "GBP"
            }
          },
          valueData: {
            folioValue: null,
            investmentAccountNumberValue: null,
            casaAccountNumberValue: null,
            frequencyValue: null,
            installmentsValue: null,
            fundHouse: null,
            fundCategory: null
          },
          extraData: {
            investmentAccountInfo: null,
            newOld: "NEW",
            cutOffDate: "2 Aug 2018",
            endDate: "02 Sept 2018",
            nowLater: "NOW",
            minAmount: "5000",
            maxAmount: "30000",
            minInstallments: "12",
            riskProfile: null
          }
        };

        return model;
      },

      baseService = BaseService.getInstance();
    let investmentAccountDeferred;
    /**
     * Private method to create a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
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
    let schemeNameRecommendedDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchRecommendedSchemes
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchRecommendedSchemes = function(deferred) {
      const
        options = {
          url: "schemes?recommended=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let maxValuesDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchMaintenanceValues
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchMaintenanceValues = function(deferred) {
      const
        options = {
          url: "maintenances/mutualfunds",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let topSchemesDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchTopSchemes
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchTopSchemes = function(deferred) {
      const
        options = {
          url: "schemes?topPurchased=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let schemeDetailsDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemeDetails
     * @memberOf ErrorModel
     * @param {string} schemeId - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemeDetails = function(schemeId, deferred) {
      const
        options = {
          url: "schemes/{schemeId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },

        params = {
          schemeId: schemeId
        };

      baseService.fetch(options, params);
    };
    let fundHouseDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchFundHouse
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchFundHouse = function(deferred) {
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
    let accountNumberDeferred;
    /**
     * Private method to fetch the severity levels created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function getAccountNumberData
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const getAccountNumberData = function(deferred) {
      const options = {
        url: "accounts/demandDeposit",
        success: function(status, jqXhr) {
          deferred.resolve(status, jqXhr);
        },
        error: function(status, jqXhr) {
          deferred.reject(status, jqXhr);
        }
      };

      baseService.fetch(options);
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
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.fetchFundHouse().done(function(data) {
       *
       *       });
       */
      fetchFundHouse: function() {
        fundHouseDeferred = $.Deferred();
        fetchFundHouse(fundHouseDeferred);

        return fundHouseDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemeDetails
       * @memberOf PurchaseMutualFundModel
       * @param {string} schemeId - Service request id for request to be updated.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.fetchSchemeDetails(schemeId).done(function(data) {
       *
       *       });
       */
      fetchSchemeDetails: function(schemeId) {
        schemeDetailsDeferred = $.Deferred();
        fetchSchemeDetails(schemeId, schemeDetailsDeferred);

        return schemeDetailsDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchRecommendedSchemes
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.fetchRecommendedSchemes().done(function(data) {
       *
       *       });
       */
      fetchRecommendedSchemes: function() {
        schemeNameRecommendedDeferred = $.Deferred();
        fetchRecommendedSchemes(schemeNameRecommendedDeferred);

        return schemeNameRecommendedDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchTopSchemes
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.fetchTopSchemes().done(function(data) {
       *
       *       });
       */
      fetchTopSchemes: function() {
        topSchemesDeferred = $.Deferred();
        fetchTopSchemes(topSchemesDeferred);

        return topSchemesDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchMaintenanceValues
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.fetchMaintenanceValues().done(function(data) {
       *
       *       });
       */
      fetchMaintenanceValues: function() {
        maxValuesDeferred = $.Deferred();
        fetchMaintenanceValues(maxValuesDeferred);

        return maxValuesDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function getAccountNumberData
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestsGlobalModel.getAccountNumberData().done(function(data) {
       *
       *       });
       */
      getAccountNumberData: function() {
        accountNumberDeferred = $.Deferred();
        getAccountNumberData(accountNumberDeferred);

        return accountNumberDeferred;
      },
      getData: function() {
        return new getData();
      }
    };
  };

  return new ServiceRequestsGlobalModel();
});

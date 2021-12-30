define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for mutual funds redeem global Model<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class RedeemFundsGlobalModel
   */
  const RedeemFundsGlobalModel = function() {
    const getData = function() {
        const model = {
          redeemFund: {
            fundHouseCode: null,
            investmentAccountNumber: null,
            recurring: false,
            transactionTypeCode: "REDEEM",
            instructionTypeCode: "ONE_TIME",
            scheme: {
              schemeCode: null,
              schemeName: null
            },
            folioNumber: null,
            scheduledDate: null,
            startDate: null,
            frequency: null,
            installments: null,
            endDate: null,
            txnAmount: {
              amount: "",
              currency: ""
            },
            txnUnits: null,
            validationRequest: null
          },
          navigationData: {
            minimumAmount: {
              currency: null,
              amount: null
            },
            maximumAmount: {
              currency: null,
              amount: null
            },
            minimumInstallments: null,
            minimumUnits: null,
            fundHouse: "",
            suitable: null,
            unitsHeld: null,
            marketValue: null,
            redeemTypeLabel: null,
            whenChanged: true,
            showEnterUnits: true,
            showAllUnits: false,
            showEnterAmount: false,
            showSwp: false,
            redeemType: "UN",
            availableUnits: null,
            when: "NOW",
            cutOffDate: null,
            endDate: "",
            nav: null,
            currency: null
          }
        };

        return model;
      },

      baseService = BaseService.getInstance();
    let investmentAccountDeferred;
    /**
     * Private method to fetch investment accounts
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
    let fundHouseDeferred;
    /**
     * Private method to fetch the fund houses
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
    let fetchFundHousesDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchFundHouses
     * @memberOf RedeemFundsGlobalModel
     * @returns {void}
     * @private
     * @param {string} investmentAccountNumber - investment account number
     * @param {Object} deferred - deferred object
     */
    const fetchFundHouses = function(investmentAccountNumber, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(option, params);
    };
    let fetchSchemesDeferred;
    /**
     * Private method to fetch the schemes
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemes
     * @memberOf RedeemFundsGlobalModel
     * @param {string} investmentAccountId - An object type String
     * @param {string} fundHouseCode - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemes = function(investmentAccountId, fundHouseCode, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/holdings?fundHouseCode={fundHouseCode}",
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

    return {
      /**
       * Public method to fetch list of investment accounts. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentAccounts
       * @memberOf RedeemFundsGlobalModel
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemFundsGlobalModel.fetchInvestmentAccounts().done(function(data) {
       *
       *       });
       */
      fetchInvestmentAccounts: function() {
        investmentAccountDeferred = $.Deferred();
        fetchInvestmentAccounts(investmentAccountDeferred);

        return investmentAccountDeferred;
      },
      /**
       * Public method to fetch list of fund houses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFundHouse
       * @memberOf RedeemFundsGlobalModel
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemFundsGlobalModel.fetchFundHouse().done(function(data) {
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
       * @function fetchMaintenanceValues
       * @memberOf PurchaseMutualFundModel
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemFundsGlobalModel.fetchMaintenanceValues().done(function(data) {
       *
       *       });
       */
      fetchMaintenanceValues: function() {
        maxValuesDeferred = $.Deferred();
        fetchMaintenanceValues(maxValuesDeferred);

        return maxValuesDeferred;
      },
      /**
       * Public method to fetch list of account holdings. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFundHouses
       * @memberOf RedeemFundsGlobalModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemFundsGlobalModel.fetchFundHouses().done(function(data) {
       *
       *       });
       */
      fetchFundHouses: function(investmentAccountNumber) {
        fetchFundHousesDeferred = $.Deferred();
        fetchFundHouses(investmentAccountNumber, fetchFundHousesDeferred);

        return fetchFundHousesDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemes
       * @memberOf RedeemFundsGlobalModel
       * @param {string} investmentAccountId - An object type String.
       * @param {string} fundHouseCode - An object type String.
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemFundsGlobalModel.fetchSchemes(investmentAccountId, fundHouseCode).done(function(data) {
       *
       *       });
       */
      fetchSchemes: function(investmentAccountId, fundHouseCode) {
        fetchSchemesDeferred = $.Deferred();
        fetchSchemes(investmentAccountId, fundHouseCode, fetchSchemesDeferred);

        return fetchSchemesDeferred;
      },
      getData: function() {
        return new getData();
      }
    };
  };

  return new RedeemFundsGlobalModel();
});

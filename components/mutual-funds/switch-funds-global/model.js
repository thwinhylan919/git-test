define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for switch funds global Model<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class SwitchFundsGlobalModel
   */
  const SwitchFundsGlobalModel = function () {
    const getData = function () {
        const model = {
          switchFund: {
            switchInDetails: {
              fundHouseCode: null,
              investmentAccountNumber: null,
              recurring: false,
              transactionTypeCode: "SWITCH",
              instructionTypeCode: "ONE_TIME",
              dividendActionCode: "REINVEST",
              scheduledDate: null,
              startDate: null,
              frequency: null,
              installments: null,
              endDate: null,
              txnAmount: {
                amount: null,
                currency: null
              },
              txnUnits: null,
              scheme: {
                schemeCode: null,
                schemeName: null,
                fundCategory: {
                  fundCategoryCode: null,
                  fundCategoryDesc: null
                }
              },
              folioNumber: null
            },
            switchOutDetails: {
              fundHouseCode: null,
              investmentAccountNumber: null,
              dividendActionCode: "REINVEST",
              recurring: false,
              transactionTypeCode: "SWITCH",
              instructionTypeCode: "ONE_TIME",
              scheme: {
                schemeCode: null,
                schemeName: null,
                fundCategory: {
                  fundCategoryCode: null,
                  fundCategoryDesc: null
                }
              },
              txnAmount: {
                amount: "",
                currency: ""
              },
              folioNumber: null
            }
          },
          navigationData: {
            investmentAccountInfo: null,
            minimumAmount: {
              currency: null,
              amount: null
            },
            maximumAmount: {
              currency: null,
              amount: null
            },
            switchOut: {
              minimumAmount: {
                currency: null,
                amount: null
              },
              cutOffDate: null,
              nav: {
                amount: null,
                currency: null
              },
              currency: null
            },
            newExisting: "new",
            minimumInstallments: null,
            minimumUnits: null,
            fundHouse: "",
            schemeName: "",
            suitable: null,
            unitsHeld: null,
            marketValue: null,
            whenChanged: true,
            showEnterUnits: true,
            showAllUnits: false,
            showEnterAmount: false,
            availableUnits: null,
            when: "NOW",
            cutOffDate: null,
            endDate: "",
            nav: {
              amount: null,
              currency: null
            },
            currency: null
          },
          reviewScreen: {
            fundHouse: null,
            switchOutFundHouse: null,
            fundCategory: null,
            switchOutScheme: null,
            switchInScheme: null,
            switchBy: null,
            when: "",
            riskProfile: ""
          }
        };

        return model;
      },
      baseService = BaseService.getInstance();
    let schemeDetailsDeferred;
    /**
     * Private method to fetch the scheme details
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemeDetails
     * @memberOf SwitchFundsGlobalModel
     * @param {string} schemeCode - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemeDetails = function (schemeCode, deferred) {
      const
        options = {
          url: "schemes/{schemeCode}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          schemeCode: schemeCode
        };

      baseService.fetch(options, params);
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
    const fetchMaintenanceValues = function (deferred) {
      const
        options = {
          url: "maintenances/mutualfunds",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let investmentAccountDeferred;
    /**
     * Private method to fetch investment accounts
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchInvestmentAccounts
     * @memberOf SwitchFundsGlobalModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchInvestmentAccounts = function (deferred) {
      const options = {
        url: "accounts/investmentAccounts",
        success: function (status, jqXhr) {
          deferred.resolve(status, jqXhr);
        },
        error: function (status, jqXhr) {
          deferred.reject(status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let schemeNameDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemeName
     * @memberOf ErrorModel
     * @param {string} investmentAccountId - An object type String
     * @param {string} fundHouseCode - An object type String
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemeName = function (investmentAccountId, fundHouseCode, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountId}/holdings?fundHouseCode={fundHouseCode}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountId: investmentAccountId,
          fundHouseCode: fundHouseCode
        };

      baseService.fetch(options, params);
    };
    let fetchDataDeferred;
    /**
     * Private method to fetch the account holdings
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchData
     * @memberOf SwitchFundsGlobalModel
     * @returns {void}
     * @private
     * @param {string} investmentAccountNumber - investment account number
     * @param {Object} deferred - deferred object
     */
    const fetchData = function (investmentAccountNumber, deferred) {
      const option = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings",
          success: function (data) {
            deferred.resolve(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(option, params);
    };
    let fundHouseDeferred;
    /**
     * Private method to fetch the fund houses
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchFundHouse
     * @memberOf SwitchFundsGlobalModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchFundHouse = function (deferred) {
      const
        options = {
          url: "fundHouses",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let schemesDeferred;
    /**
     * Private method to fetch the list of schemes
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemes
     * @memberOf SwitchFundsGlobalModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemes = function (deferred) {
      const
        options = {
          url: "schemes",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let folioDataDeferred;
    /**
     * Private method to fetch the folios
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchFolio
     * @memberOf SwitchFundsGlobalModel
     * @param {string} accountId - An object type deferred
     * @param {string} fundHouseCode - An object type deferred
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchFolio = function (accountId, fundHouseCode, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{accountId}/folios?fundHouseCode={fundHouseCode}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          accountId: accountId,
          fundHouseCode: fundHouseCode
        };

      baseService.fetch(options, params);
    };
    let fetchSchemesFilteredDeferred;
    /**
     * Private method to fetch the schemes on the basis of fund house code
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSchemesFiltered
     * @memberOf SwitchFundsGlobalModel
     * @param {string} fundHouseCode - An object type deferred
     * @param {string} schemeCategory - An object of type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSchemesFiltered = function (fundHouseCode, schemeCategory, deferred) {
      const
        options = {
          url: "schemes?fundHouseCode={fundHouseCode}&schemeCategory={schemeCategory}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          fundHouseCode: fundHouseCode,
          schemeCategory: schemeCategory
        };

      baseService.fetch(options, params);
    };
    let fundCategoryDeferred;
    /**
     * Private method to fetch the fund Categories
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchFundCategory
     * @memberOf SwitchFundsGlobalModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchFundCategory = function (deferred) {
      const
        options = {
          url: "schemeCategories",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let holdingDetailsDeferred;
    /**
     * Private method to fetch account holding details
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchHoldingDetails
     * @memberOf RedeemOrderDetailsModel
     * @param {string} investmentAccountNumber - An object type string
     * @param {string} accountHoldingId - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchHoldingDetails = function (investmentAccountNumber, accountHoldingId, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}/holdings/{accountHoldingId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber,
          accountHoldingId: accountHoldingId
        };

      baseService.fetch(options, params);
    };
    let fetchAccountDetailsDeferred;
    /**
     * Private method to fetch investment account details for particular investment account
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchAccountDetails
     * @memberOf DashboardModel
     * @param {string} investmentAccountNumber - An object type string
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchAccountDetails = function (investmentAccountNumber, deferred) {
      const
        options = {
          url: "accounts/investmentAccounts/{investmentAccountNumber}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          investmentAccountNumber: investmentAccountNumber
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Public method to fetch scheme details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemeDetails
       * @memberOf SwitchFundsGlobalModel
       * @param {string} schemeCode - Scheme code.
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchSchemeDetails(schemeCode).done(function(data) {
       *
       *       });
       */
      fetchSchemeDetails: function (schemeCode) {
        schemeDetailsDeferred = $.Deferred();
        fetchSchemeDetails(schemeCode, schemeDetailsDeferred);

        return schemeDetailsDeferred;
      },
      /**
       * Public method to fetch list of account holdings. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchData
       * @memberOf SwitchFundsGlobalModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchData().done(function(data) {
       *
       *       });
       */
      fetchData: function (investmentAccountNumber) {
        fetchDataDeferred = $.Deferred();
        fetchData(investmentAccountNumber, fetchDataDeferred);

        return fetchDataDeferred;
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
       *       SwitchFundsGlobalModel.fetchMaintenanceValues().done(function(data) {
       *
       *       });
       */
      fetchMaintenanceValues: function () {
        maxValuesDeferred = $.Deferred();
        fetchMaintenanceValues(maxValuesDeferred);

        return maxValuesDeferred;
      },
      /**
       * Public method to fetch list of investment accounts. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentAccounts
       * @memberOf SwitchFundsGlobalModel
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchInvestmentAccounts().done(function(data) {
       *
       *       });
       */
      fetchInvestmentAccounts: function () {
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
       * @function fetchSchemeName
       * @memberOf SwitchFundsGlobalModel
       * @param {string} investmentAccountId - An object type String.
       * @param {string} fundHouseCode - For request to be updated.
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchSchemeName(investmentAccountId, fundHouseCode).done(function(data) {
       *
       *       });
       */
      fetchSchemeName: function (investmentAccountId, fundHouseCode) {
        schemeNameDeferred = $.Deferred();
        fetchSchemeName(investmentAccountId, fundHouseCode, schemeNameDeferred);

        return schemeNameDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemesFiltered
       * @memberOf SwitchFundsGlobalModel
       * @param {string} fundHouseCode - For request to be updated.
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchSchemesFiltered(fundHouseCode).done(function(data) {
       *
       *       });
       */
      fetchSchemesFiltered: function (fundHouseCode, schemeCategory) {
        fetchSchemesFilteredDeferred = $.Deferred();
        fetchSchemesFiltered(fundHouseCode, schemeCategory, fetchSchemesFilteredDeferred);

        return fetchSchemesFilteredDeferred;
      },
      /**
       * Public method to fetch list of fund houses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFundHouse
       * @memberOf SwitchFundsGlobalModel
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchFundHouse().done(function(data) {
       *
       *       });
       */
      fetchFundHouse: function () {
        fundHouseDeferred = $.Deferred();
        fetchFundHouse(fundHouseDeferred);

        return fundHouseDeferred;
      },
      /**
       * Public method to fetch list of schemes. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSchemes
       * @memberOf SwitchFundsGlobalModel
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchSchemes().done(function(data) {
       *
       *       });
       */
      fetchSchemes: function () {
        schemesDeferred = $.Deferred();
        fetchSchemes(schemesDeferred);

        return schemesDeferred;
      },
      /**
       * Public method to fetch list of folios. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFolio
       * @memberOf SwitchFundsGlobalModel
       * @param {string} accountId - An object type deferred.
       * @param {string} fundHouseCode - An object type deferred.
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchFolio(accountId,fundHouseCode).done(function(data) {
       *
       *       });
       */
      fetchFolio: function (accountId, fundHouseCode) {
        folioDataDeferred = $.Deferred();
        fetchFolio(accountId, fundHouseCode, folioDataDeferred);

        return folioDataDeferred;
      },
      /**
       * Public method to fetch list of fund categories. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchFundCategory
       * @memberOf SwitchFundsGlobalModel
       * @returns {Object} - DeferredObject.
       * @example
       *       SwitchFundsGlobalModel.fetchFundCategory().done(function(data) {
       *
       *       });
       */
      fetchFundCategory: function () {
        fundCategoryDeferred = $.Deferred();
        fetchFundCategory(fundCategoryDeferred);

        return fundCategoryDeferred;
      },
      /**
       * Public method to fetch scheme details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchHoldingDetails
       * @memberOf RedeemOrderDetailsModel
       * @param {string} investmentAccountNumber - An object type string.
       * @param {string} accountHoldingId - An object type string.
       * @returns {Object} - DeferredObject.
       * @example
       *       RedeemOrderDetailsModel.fetchHoldingDetails(investmentAccountNumber, accountHoldingId).done(function(data) {
       *
       *       });
       */
      fetchHoldingDetails: function (investmentAccountNumber, accountHoldingId) {
        holdingDetailsDeferred = $.Deferred();
        fetchHoldingDetails(investmentAccountNumber, accountHoldingId, holdingDetailsDeferred);

        return holdingDetailsDeferred;
      },
      /**
       * Public method to fetch investment account details for particular investment account.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchAccountDetails
       * @memberOf DashboardModel
       * @param {string} investmentAccountNumber - Investment account number.
       * @returns {Object} - DeferredObject.
       * @example
       *       DashboardModel.fetchAccountDetails(investmentAccountNumber).done(function(data) {
       *
       *       });
       */
      fetchAccountDetails: function (investmentAccountNumber) {
        fetchAccountDetailsDeferred = $.Deferred();
        fetchAccountDetails(investmentAccountNumber, fetchAccountDetailsDeferred);

        return fetchAccountDetailsDeferred;
      },
      getData: function () {
        return new getData();
      }
    };
  };

  return new SwitchFundsGlobalModel();
});
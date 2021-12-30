define(["baseService", "jquery"], function (BaseService, $) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  const forexCalculatorModel = function () {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * This function fires a GET request to fetch the product flow details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchProductFlow
     * @memberOf ProductService
     * @param {String} productCode      - String indicating the product code of the product whose flow details are to be fetched
     * @param {Function} successHandler - function to be called once the flow details are successfully fetched
     * @example ProductService.fetchProductFlow('productCode',handler);
     */
    let fetchLoanCalculatorDeferred;
    const fetchLoanCalculator = function (dataToBeSent, deferred) {
      const options = {
        url: "calculators/mortgage/schedule",
        data: dataToBeSent,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let fetchCurrencyDeferred;
    const fetchCurrency = function (deferred) {
      const options = {
        url: "forex/currencyPairs",
        mockedUrl: "framework/json/design-dashboard/calculators/forex-calculator.json",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetchWidget(options);
    };
    let fetchExAmountDeferred;
    const fetchExAmount = function (payload, deferred) {
      const options = {
        url: "calculators/foreignExchange",
        data: payload,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };

    return {
      fetchLoanCalculator: function (dataToBeSent) {
        fetchLoanCalculatorDeferred = $.Deferred();
        fetchLoanCalculator(dataToBeSent, fetchLoanCalculatorDeferred);

        return fetchLoanCalculatorDeferred;
      },
      fetchExAmount: function (payload) {
        fetchExAmountDeferred = $.Deferred();
        fetchExAmount(payload, fetchExAmountDeferred);

        return fetchExAmountDeferred;
      },
      fetchCurrency: function () {
        fetchCurrencyDeferred = $.Deferred();
        fetchCurrency(fetchCurrencyDeferred);

        return fetchCurrencyDeferred;
      }
    };
  };

  return new forexCalculatorModel();
});
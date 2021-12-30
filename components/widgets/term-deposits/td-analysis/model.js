define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  const AnalysisModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let params;
    /**
     * This function fires a GET request to fetch the product flow details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched.
     *
     * @function fetchProductFlow
     * @memberOf ProductService
     * @param {string} productCode      - String indicating the product code of the product whose flow details are to be fetched.
     * @param {Function} successHandler - Function to be called once the flow details are successfully fetched.
     * @example ProductService.fetchProductFlow('productCode',handler);
     */
    const fetchAccountInfo = function(fetchAccountDeferred) {
        const options = {
          url: "accounts/deposit",
          mockedUrl:"framework/json/design-dashboard/term-deposits/td-analysis/accounts.json",
          success: function(data) {
            fetchAccountDeferred.resolve(data);
          }
        };

        baseService.fetchWidget(options);

      },
      fetchBankConfig = function(deferred) {
        const options = {
          url: "bankConfiguration",
          mockedUrl:"framework/json/design-dashboard/term-deposits/td-analysis/bank-config.json",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetchWidget(options, params);

      };

    return {
      fetchBankConfig: function() {
        const fetchBankConfigDeferred = $.Deferred();

        fetchBankConfig(fetchBankConfigDeferred);

        return fetchBankConfigDeferred;
      },
      fetchAccountInfo: function() {
        const fetchAccountDeferred = $.Deferred();

        fetchAccountInfo(fetchAccountDeferred);

        return fetchAccountDeferred;
      }
    };
  };

  return new AnalysisModel();
});
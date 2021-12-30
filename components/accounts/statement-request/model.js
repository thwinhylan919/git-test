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
  const StatementModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let params;
    const Model = function() {
      this.payLoadData = {
        fromDate: null,
        toDate: null,
        selectedAccount: null
      };
    };
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
    let requestPhysicalStatementDeferred;
    const requestPhysicalStatement = function(accountId, payload, applicationUrl, module, deferred) {
      params = {
        accountId: accountId,
        applicationUrl: applicationUrl,
        module: module
      };

      let url;

      if (applicationUrl === "deposit") {
        url = "accounts/{applicationUrl}/{accountId}/adhocStatement;module={module}";
      } else {
        url = "accounts/{applicationUrl}/{accountId}/adhocStatement";
      }

      const options = {
        url: url,
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options, params);
    };
    let fetchCurrentDateDeferred;
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
      fetchCurrentDate: function() {
        fetchCurrentDateDeferred = $.Deferred();
        fetchCurrentDate(fetchCurrentDateDeferred);

        return fetchCurrentDateDeferred;
      },
      requestPhysicalStatement: function(accountId, payload, applicationUrl, module) {
        requestPhysicalStatementDeferred = $.Deferred();
        requestPhysicalStatement(accountId, payload, applicationUrl, module, requestPhysicalStatementDeferred);

        return requestPhysicalStatementDeferred;
      },
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      }
    };
  };

  return new StatementModel();
});
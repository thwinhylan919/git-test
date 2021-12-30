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
  const ListingModel = function () {
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
    let fetchCardInfoDeferred;
    const fetchCardInfo = function (deferred) {
      const options = {
        url: "accounts/cards/credit?expand=ALL",
        mockedUrl: "framework/json/design-dashboard/accounts/financial-summary/cards.json",
        showMessage: false,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetchWidget(options);
    };
    let fetchAccountsDeferred;
    const fetchAccounts = function (deferred) {
      const options = {
        url: "accounts",
        mockedUrl: "framework/json/design-dashboard/accounts/financial-summary/accounts.json",
        showMessage: false,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetchWidget(options);
    };

    return {
      fetchCardInfo: function () {
        fetchCardInfoDeferred = $.Deferred();
        fetchCardInfo(fetchCardInfoDeferred);

        return fetchCardInfoDeferred;
      },
      fetchAccounts: function () {
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred);

        return fetchAccountsDeferred;
      }
    };
  };

  return new ListingModel();
});
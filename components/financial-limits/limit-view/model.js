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
  const CreateLimitModel = function() {
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
    let fetchLimitDetailsDeffered, deleteLimitDeffered;
    const fetchLimitDetails = function(deferred, id) {
        const params = {
          id:id
        },
          options = {
            url: "financialLimits/{id}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);
      },
      deleteLimit = function(deferred, id) {
        const params = {
          id:id
        },
          options = {
            url: "financialLimits/{id}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };

        baseService.remove(options, params);
      };

    return {
      fetchLimitDetails: function(id) {
        fetchLimitDetailsDeffered = $.Deferred();
        fetchLimitDetails(fetchLimitDetailsDeffered, id);

        return fetchLimitDetailsDeffered;
      },
      deleteLimit: function(id) {
        deleteLimitDeffered = $.Deferred();
        deleteLimit(deleteLimitDeffered, id);

        return deleteLimitDeffered;
      }
    };
  };

  return new CreateLimitModel();
});
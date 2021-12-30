define(["baseService", "jquery"], function(BaseService, $) {
    "use strict";

  const AvailableLimitModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * This function fires a GET request to fetch the available-limits details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchAvailableLimits
     * @param {String} taskCode      - String indicating the task code of the transaction whose vailable-limit details are to be fetched
     * @example ProductService.fetchProductFlow('productCode',handler);
     */
    let fetchAvailableLimitsDeferred;
    const fetchAvailableLimits = function(deferred, queryParams) {
      const params = {
          taskCode: queryParams.taskCode,
          payeeId: queryParams.payeeId,
          accessPointValue: queryParams.accessPointValue,
          networkType: queryParams.networkType
        },
        options = {
          url: "me/availableLimits/{taskCode}?payeeId={payeeId}&accessPointValue={accessPointValue}&networkType={networkType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
        fetchAvailableLimits: function(queryParams) {
        fetchAvailableLimitsDeferred = $.Deferred();
        fetchAvailableLimits(fetchAvailableLimitsDeferred, queryParams);

        return fetchAvailableLimitsDeferred;
      }
    };
  };

  return new AvailableLimitModel();
});

define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  /**
   * This file contains the Tech Agnostic model
   * consisting of all the REST services APIs for the generic component row.
   *
   * @namespace SessionSummaryModel~model
   * @class SessionSummaryModel
   * @extends BaseService {@link BaseService}
   */
  const SessionSummaryModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let params,
      /**
       * This function fires a GET request to fetch the address associated with 'me' party id
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchAddressInfo
       * @memberOf SessionSummaryModel
       * @example SessionSummaryModel.fetchAddressInfo();
       */
      getDetailsDeferred;
    const getDetails = function(deferred) {
      const uri = "me/sessions",
        options = {
          url: uri,
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
      getDetails: function() {
        getDetailsDeferred = $.Deferred();
        getDetails(getDetailsDeferred);

        return getDetailsDeferred;
      }
    };
  };

  return new SessionSummaryModel();
});
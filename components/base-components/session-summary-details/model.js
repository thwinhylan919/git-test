define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  /**
   * This file contains the Tech Agnostic model
   * consisting of all the REST services APIs for the generic component row.
   *
   * @namespace SessionSummaryDetailsModel~model
   * @class SessionSummaryDetailsModel
   * @extends BaseService {@link BaseService}
   */
  const SessionSummaryDetailsModel = function() {
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
       * @memberOf SessionSummaryDetailsModel
       * @example SessionSummaryDetailsModel.fetchAddressInfo();
       */
      getDetailsDeferred;
    const getDetails = function(sessionId, deferred) {
      const uri = "me/sessions/" + sessionId,
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
      getDetails: function(sessionID) {
        getDetailsDeferred = $.Deferred();
        getDetails(sessionID, getDetailsDeferred);

        return getDetailsDeferred;
      }
    };
  };

  return new SessionSummaryDetailsModel();
});
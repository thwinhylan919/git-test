define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Let ServiceAdvisorsBaseModel - description.
   *
   * @return {type}  Description.
   */
  const ServiceAdvisorsBaseModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAdvisorsDeferred;
    /**
     * FetchAdvisors - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchAdvisors = function(deferred) {
      const options = {
        url: "me/party/serviceAdvisor",
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
      /**
       * FetchAdvisors - description.
       *
       * @return {type}  Description.
       */
      fetchAdvisors: function() {
        fetchAdvisorsDeferred = $.Deferred();
        fetchAdvisors(fetchAdvisorsDeferred);

        return fetchAdvisorsDeferred;
      }
    };
  };

  return new ServiceAdvisorsBaseModel();
});
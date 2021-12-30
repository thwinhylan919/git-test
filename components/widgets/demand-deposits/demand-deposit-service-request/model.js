define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * Model file for service request raised section. This file contains the model definition
   * for ServiceRequest  section and exports the ServiceRequestModel model which can be used
   * as a component in any form in which service request needs to be represented.
   *
   * @namespace ServiceRequestModel~ServiceRequestModel
   * @property {Object} fetchAccountInfoDeferred -To store the deferred object
   * @property {Object} baseService -To store Baseservice object
   */
  const ServiceRequestModel = function() {
    const baseService = BaseService.getInstance();

    /**
     * Method to fetch servicerequest data for particular partyId
     * @deferred object is resolved once the accounts information list is successfully fetched
     * @partyId - partyId for which list of service request needs to fetched
     */
    return {
      fetchAccountInfo: function() {

        return baseService.fetchWidget({
          url: "servicerequest?locale=en",
          mockedUrl:"framework/json/design-dashboard/demand-deposits/demand-deposit-service-request.json"
        });
      }
    };
  };

  return new ServiceRequestModel();
});
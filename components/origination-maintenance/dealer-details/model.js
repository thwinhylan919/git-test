/**
 * Model for dealer-details
 * @param1 {object} jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * return {object} dealerDetailsModel Modal instance
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const dealerDetailsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchDealerDetails - fetches details of the delaers maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchDealerDetails: function() {
        return baseService.fetch({
          url: "dealers"
        });
      }
    };
  };

  return new dealerDetailsModel();
});

define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const P2PModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let readP2PDeferred;
    const readP2P = function(paymentId, deferred) {
      const options = {
          url: "payments/transfers/peerToPeer/{paymentId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          paymentId: paymentId
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Method to initialize the described model.
       */
      readP2P: function(paymentId) {
        readP2PDeferred = $.Deferred();
        readP2P(paymentId, readP2PDeferred);

        return readP2PDeferred;
      },
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      }
    };
  };

  return new P2PModel();
});
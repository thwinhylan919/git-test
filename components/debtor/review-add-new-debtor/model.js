define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const newDebtorModel = function() {
    const baseService = BaseService.getInstance();
    let readDebtorDeferred;
    const readDebtor = function(payerId, groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          payerId: payerId,
          groupId: groupId
        };

      baseService.fetch(options, params);
    };

    return {
      readDebtor: function(payerId, groupId) {
        readDebtorDeferred = $.Deferred();
        readDebtor(payerId, groupId, readDebtorDeferred);

        return readDebtorDeferred;
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      }
    };
  };

  return new newDebtorModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewQuickPaymentModel = function() {
      let billPaymentDeferred;
      const billPayment = function(model, deferred) {
        const options = {
          url: "ebillPayments",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };
      let fetchBillerDetailsDeferred;
      const fetchBillerDetails = function(billerId, deferred) {
        const options = {
            url: "billers/{billerId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            billerId: billerId
          };

        baseService.fetch(options, params);
      };

      return {
        billPayment: function(model) {
          billPaymentDeferred = $.Deferred();
          billPayment(model, billPaymentDeferred);

          return billPaymentDeferred;
        },
        fetchBillerDetails: function(billerId) {
          fetchBillerDetailsDeferred = $.Deferred();
          fetchBillerDetails(billerId, fetchBillerDetailsDeferred);

          return fetchBillerDetailsDeferred;
        }
      };
    };

  return new ReviewQuickPaymentModel();
});
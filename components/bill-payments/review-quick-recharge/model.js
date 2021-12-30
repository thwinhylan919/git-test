define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewQuickRechargeModel = function() {
      let quickBillPaymentDeferred;
      const quickBillPayment = function(model, deferred) {
        const options = {
          url: "ebillPayments",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };

      return {
        quickBillPayment: function(model) {
          quickBillPaymentDeferred = $.Deferred();
          quickBillPayment(model, quickBillPaymentDeferred);

          return quickBillPaymentDeferred;
        }
      };
    };

  return new ReviewQuickRechargeModel();
});
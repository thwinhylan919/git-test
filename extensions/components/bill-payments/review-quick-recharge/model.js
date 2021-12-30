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
          version: "cz/v1",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };

      let doConfirmDeferred;
      const doConfirm = function(enquiryData, deferred) {
        const options = {
            url: "billers/confirm",
            version:"cz/v1",
            data: enquiryData,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            enquiryData: enquiryData
          };

        baseService.add(options, params);
      };

      return {
        quickBillPayment: function(model) {
          quickBillPaymentDeferred = $.Deferred();
          quickBillPayment(model, quickBillPaymentDeferred);

          return quickBillPaymentDeferred;
        },
        doConfirm: function(bienquiryData) {
          doConfirmDeferred = $.Deferred();
          doConfirm(bienquiryData, doConfirmDeferred);

          return doConfirmDeferred;
        }
      };
    };

  return new ReviewQuickRechargeModel();
});
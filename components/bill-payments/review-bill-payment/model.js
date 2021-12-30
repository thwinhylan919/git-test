define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewBillPaymentModel = function() {
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
      let fetchRegBillerDetailsDeferred;
    const fetchRegBillerDetails = function(billerRegistrationId, deferred) {
      const options = {
          url: "registeredBillers/{billerRegistrationId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          billerRegistrationId: billerRegistrationId
        };

      baseService.fetch(options, params);
    };

      let fetchBillerDetailsDeferred;
      const getBillerDetails = function(billerId, deferred) {
      const options = {
        url: "billers/{billerId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          billerId: billerId
        };

        baseService.fetch(options, params);
      };
      let fireBatchDeferred;
      const fireBatch = function(deferred, subRequestList, type) {
        const options = {
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.batch(options, {
          type: type
        }, subRequestList);
      };

      let fetchBillerLogosDeferred;
    const fetchBillerLogos = function(billerId, deferred) {
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
        getBillerDetails: function(billerId) {
          fetchBillerDetailsDeferred = $.Deferred();
          getBillerDetails(billerId, fetchBillerDetailsDeferred);

          return fetchBillerDetailsDeferred;
        },
        fetchBillerLogos: function(billerId) {
          fetchBillerLogosDeferred = $.Deferred();
          fetchBillerLogos(billerId, fetchBillerLogosDeferred);

          return fetchBillerLogosDeferred;
        },

        fireBatch: function(subRequestList, type) {
          fireBatchDeferred = $.Deferred();
          fireBatch(fireBatchDeferred, subRequestList, type);

          return fireBatchDeferred;
        },

        fetchRegBillerDetails: function(billerRegistrationId) {
          fetchRegBillerDetailsDeferred = $.Deferred();
          fetchRegBillerDetails(billerRegistrationId, fetchRegBillerDetailsDeferred);

          return fetchRegBillerDetailsDeferred;
        }
      };
    };

  return new ReviewBillPaymentModel();
});
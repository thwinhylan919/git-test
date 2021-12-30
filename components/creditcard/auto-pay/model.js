define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for Auto pay.
   *
   * @namespace ManageLimit~AutoPayModel
   * @class
   */
  const AutoPayModel = function() {
    let params;
    const baseService = BaseService.getInstance();
    let fetchAutopayDeferred;
    const fetchAutopay = function(creditCardId, deferred) {
      params = {
        creditCardId: creditCardId
      };

      const options = {
        url: "accounts/cards/credit/{creditCardId}/repayment",
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
      fetchAutopay: function(creditCardId) {
        fetchAutopayDeferred = $.Deferred();
        fetchAutopay(creditCardId, fetchAutopayDeferred);

        return fetchAutopayDeferred;
      },
      createAutopay: function(payload, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/repayment",
          data: payload
        };

        return baseService.add(options, params);
      },
      updateAutopay: function(payload, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/repayment",
          data: payload
        };

        return baseService.update(options, params);
      },
      deleteAutopay: function(payload, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/repayment",
          data: payload
        };

        return baseService.remove(options, params);
      }
    };
  };

  return new AutoPayModel();
});

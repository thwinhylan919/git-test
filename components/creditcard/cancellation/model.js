define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const CancellationModel = function() {
    const baseService = BaseService.getInstance();
    let getCancelReasonsDeferred;
    const getCancelReasons = function(deferred) {
      const options = {
        url: "enumerations/cardCancelReasons",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchCancelReasons: function() {
        getCancelReasonsDeferred = $.Deferred();
        getCancelReasons(getCancelReasonsDeferred);

        return getCancelReasonsDeferred;
      },
      cancelCard: function(model, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/status",
          data: model
        };

        return baseService.update(options, params);
      }
    };
  };

  return new CancellationModel();
});

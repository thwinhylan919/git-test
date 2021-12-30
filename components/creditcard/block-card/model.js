define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BlockCardModel = function() {
    const baseService = BaseService.getInstance();
    let getHotlistReasonsDeferred;
    const getHotlistReasons = function(deferred) {
      const options = {
        url: "enumerations/cardHotlistReasons",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getHotlistReasons: function() {
        getHotlistReasonsDeferred = $.Deferred();
        getHotlistReasons(getHotlistReasonsDeferred);

        return getHotlistReasonsDeferred;
      },
      blockCard: function(model, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/status",
          data: model
        };

        return baseService.update(options, params);
      },
      replaceCard: function(model, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/replace",
          data: model
        };

        return baseService.add(options, params);
      }
    };
  };

  return new BlockCardModel();
});

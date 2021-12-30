define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BlockCardModel = function() {
    let params;
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
    let blockCardDeferred;
    const blockCard = function(model, creditCardId, deferred) {
      params = {
        creditCardId: creditCardId
      };

      const options = {
        url: "accounts/cards/credit/{creditCardId}/status",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.update(options, params);
    };
    let replaceCardDeferred;
    const replaceCard = function(model, creditCardId, deferred) {
      params = {
        creditCardId: creditCardId
      };

      const options = {
        url: "accounts/cards/credit/{creditCardId}/replace",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options, params);
    };

    return {
      getHotlistReasons: function() {
        getHotlistReasonsDeferred = $.Deferred();
        getHotlistReasons(getHotlistReasonsDeferred);

        return getHotlistReasonsDeferred;
      },
      blockCard: function(model, creditCardId) {
        blockCardDeferred = $.Deferred();
        blockCard(model, creditCardId, blockCardDeferred);

        return blockCardDeferred;
      },
      replaceCard: function(model, creditCardId) {
        replaceCardDeferred = $.Deferred();
        replaceCard(model, creditCardId, replaceCardDeferred);

        return replaceCardDeferred;
      }
    };
  };

  return new BlockCardModel();
});
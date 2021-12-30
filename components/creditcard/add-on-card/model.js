define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AddOndModel = function() {
    let params;
    const baseService = BaseService.getInstance();
    let fetchLimitDeferred;
    /**
     * Function executes the "GET" method to fetch the limits of given credit card.
     *
     * @function getLimits
     * @memberOf AddOndModel
     * @param {creditCardId} -  - Credit card to be used as the parameter.
     * @param {deferred} - - Resolved after successful execution or rejected after failure.
     **/
    const getLimits = function(creditCardId, deferred) {
      params = {
        creditCardId: creditCardId
      };

      const options = {
        url: "accounts/cards/credit/{creditCardId}/limit",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    let getRelationshipListDeferred;
    const getRelationshipList = function(deferred) {
      const options = {
        url: "enumerations/relationshipType",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchLimit: function(creditCardId) {
        fetchLimitDeferred = $.Deferred();
        getLimits(creditCardId, fetchLimitDeferred);

        return fetchLimitDeferred;
      },
      addCard: function(model, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/supplementary",
          data: model
        };

        return baseService.add(options, params);
      },
      getRelationshipList: function() {
        getRelationshipListDeferred = $.Deferred();
        getRelationshipList(getRelationshipListDeferred);

        return getRelationshipListDeferred;
      }
    };
  };

  return new AddOndModel();
});

define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const billerModel = function() {
    const baseService = BaseService.getInstance();
    let getBillerDescriptionDeferred;
    const getBillerDescription = function(billerId, deferred) {
      const options = {
        url: "payments/billers/{billerId}",
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
    let getPartyBillerRelationshipDetailsDeferred;
    const getPartyBillerRelationshipDetails = function(billerId, relationshipNumber, deferred) {
      const options = {
        url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          billerId: billerId,
          relationshipNumber:relationshipNumber
        };

      baseService.fetch(options, params);
    };

    return {
      getBillerDescription: function(billerId) {
        getBillerDescriptionDeferred = $.Deferred();
        getBillerDescription(billerId, getBillerDescriptionDeferred);

        return getBillerDescriptionDeferred;
      },
      getPartyBillerRelationshipDetails: function(billerId, relationshipNumber) {
        getPartyBillerRelationshipDetailsDeferred = $.Deferred();
        getPartyBillerRelationshipDetails(billerId, relationshipNumber, getPartyBillerRelationshipDetailsDeferred);

        return getPartyBillerRelationshipDetailsDeferred;
      }
    };
  };

  return new billerModel();
});
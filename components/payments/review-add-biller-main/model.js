define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const newBillerModel = function() {
    const
      baseService = BaseService.getInstance();
    let getBillerDetailsDeferred;
    const getBillerDetails = function(billerId, relationshipNumber, deferred) {
      const options = {
        url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}",
        success: function(data) {
          deferred.resolve(data);
        }
      },
        params = {
          billerId: billerId,
          relationshipNumber: relationshipNumber
        };

      baseService.fetch(options, params);
    };
    let getBillerDescriptionDeferred;
    const getBillerDescription = function(billerId, deferred) {
      const options = {
        url: "payments/billers/{billerId}",
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
      getBillerDetails: function(billerId, relationshipNumber) {
        getBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, relationshipNumber, getBillerDetailsDeferred);

        return getBillerDetailsDeferred;
      },
      getBillerDescription: function(billerId) {
        getBillerDescriptionDeferred = $.Deferred();
        getBillerDescription(billerId, getBillerDescriptionDeferred);

        return getBillerDescriptionDeferred;
      }
    };
  };

  return new newBillerModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BillerDetailsModel = function() {
    const
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      baseService = BaseService.getInstance();
    let deleteBillerDeferred;
    const deleteBiller = function(billerId, relationshipNumber, deferred) {
      const options = {
        url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      },
      params = {
        billerId: billerId,
        relationshipNumber: relationshipNumber
      };

      baseService.remove(options, params);
    };

    return {
      deleteBiller: function(billerId, relationshipNumber) {
        deleteBillerDeferred = $.Deferred();
        deleteBiller(billerId, relationshipNumber, deleteBillerDeferred);

        return deleteBillerDeferred;
      }
    };
  };

  return new BillerDetailsModel();
});
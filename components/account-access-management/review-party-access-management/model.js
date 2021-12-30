define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reviewPartyAccountAccessModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * This function creates the access
     * @params {deferred} - object to trach completion of Batch call
     * {payload} - payload of batch service
     * @function readUserAccountAccess
     * @memberOf ExclusionModel
     **/
    let readAllAccountDetailsDeferred;
    const readAllAccountDetails = function(partyId, deferred) {
        const params = {
          partyId: partyId
        },
        options = {
          url: "accountAccess?partyId={partyId}&accountType=CSA&accountType=TRD&accountType=LON&accountType=VER&accountType=VRA&accountType=LER",
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
      readAllAccountDetails: function(partyId) {
        readAllAccountDetailsDeferred = $.Deferred();
        readAllAccountDetails(partyId, readAllAccountDetailsDeferred);

        return readAllAccountDetailsDeferred;
      }
    };
  };

  return new reviewPartyAccountAccessModel();
});
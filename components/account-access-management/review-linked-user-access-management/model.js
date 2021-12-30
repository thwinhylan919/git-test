define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reviewLinkedUserAccountAccessModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * This function fetches the Account access details for the given partyId and userID
     * @params {deferred} - object to trach completion of the request
     * {payload} - payload of batch service
     * @function readUserAccountAccess
     * @memberOf ExclusionModel
     **/
    let readAllUserAccountDetailsDeferred;
    const readAllUserAccountDetails = function(partyId, userId, deferred) {
        const params = {
          partyId: partyId,
          userId: userId
        },
        options = {
        url: "accountAccess?partyId={partyId}&userId={userId}&accountType=CSA&accountType=TRD&accountType=LON",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    /**
     * This function creates the access
     * @params {deferred} - object to trach completion of Batch call
     * {payload} - payload of batch service
     * @function readUserAccountAccess
     * @memberOf ExclusionModel
     **/
    let readUserDetailsDeferred;
    const readUserDetails = function(userId, deferred) {
        const params = {
          userId: userId
        },
        options = {
        url: "users/{userId}",
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
      readAllUserAccountDetails: function(partyId, userId) {
        readAllUserAccountDetailsDeferred = $.Deferred();
        readAllUserAccountDetails(partyId, userId, readAllUserAccountDetailsDeferred);

        return readAllUserAccountDetailsDeferred;
      },
      readUserDetails: function(userId) {
        readUserDetailsDeferred = $.Deferred();
        readUserDetails(userId, readUserDetailsDeferred);

        return readUserDetailsDeferred;
      }
    };
  };

  return new reviewLinkedUserAccountAccessModel();
});
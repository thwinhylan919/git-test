define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserListDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAssociatedUserForPartyDeferred;
    const fetchAssociatedUserForParty = function(partyID, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "users?partyId={partyId}&isAccessSetupCheckRequired=true",
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
      fetchAssociatedUserForParty: function(batchData) {
        fetchAssociatedUserForPartyDeferred = $.Deferred();
        fetchAssociatedUserForParty(batchData, fetchAssociatedUserForPartyDeferred);

        return fetchAssociatedUserForPartyDeferred;
      }
    };
  };

  return new UserListDetailsModel();
});
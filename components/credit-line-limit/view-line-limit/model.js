define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ViewLineLimitModel = function() {
      let fetchPartyDetailsDeferred;
      const fetchPartyDetails = function(partyId, deferred) {
        const params = {
            partyId: partyId
          },
          options = {
            url: "me/party/relations/{partyId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };

      return {
        fetchPartyDetails: function(partyId) {
          fetchPartyDetailsDeferred = $.Deferred();
          fetchPartyDetails(partyId, fetchPartyDetailsDeferred);

          return fetchPartyDetailsDeferred;
        }
      };
    };

  return new ViewLineLimitModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserListModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.partyDetails = {
          partyFirstName: null,
          partyLastName: null,
          userType: "CUSTOMER",
          partyName: null,
          partyDetailsFetched: false,
          additionalDetails: "",
          userTypeLabel: "",
          party: {
            value: "",
            displayValue: ""
          }
        };
      };
    let fetchMeDeferred, fetchMeWithPartyDeferred;
    const fetchMe = function(deferred) {
        const options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchMeWithParty = function(deferred) {
        const options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);

        return fetchMeDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);

        return fetchMeWithPartyDeferred;
      }
    };
  };

  return new UserListModel();
});

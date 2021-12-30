define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reportUserSearchModel = function() {
    const
      baseService = BaseService.getInstance();
    let listUsersDeferred;
    const listUsers = function(deferred, URL) {
      const options = {
        url: URL,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listMappedUsersDeferred;
    const listMappedUsers = function(deferred, partyId) {
      const options = {
          url: "reports/reportDefinition/userReportMappings?partyId={partyId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          partyId: partyId
        };

      baseService.fetch(options, params);
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
      listUsers: function(URL) {
        listUsersDeferred = $.Deferred();
        listUsers(listUsersDeferred, URL);

        return listUsersDeferred;
      },
      listMappedUsers: function(partyId) {
        listMappedUsersDeferred = $.Deferred();
        listMappedUsers(listMappedUsersDeferred, partyId);

        return listMappedUsersDeferred;
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

  return new reportUserSearchModel();
});
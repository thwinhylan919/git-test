define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const CreateMailersModel = function() {
    const Model = function() {
        this.mailersModel = {
          code: null,
          messageType: null,
          subject: null,
          messageBody: null,
          bannerBody: "",
          description: null,
          recipients: [],
          activationDate: null
        };
      },
      baseService = BaseService.getInstance();
    let listEnterpriseRolesDeferred;
    const listEnterpriseRoles = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchUsersListDeferred;
    const fetchUsersList = function(userId, deferred) {
      const params = {
        userId: userId
      },
      options = {
        url: "users?username={userId}&userType=corporateuser&userType=retailuser&userType=administrator",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchPartyListDeferred;
    const fetchPartyList = function(partyId, deferred) {
      const params = {
        partyId: partyId
      },
      options = {
        url: "parties?partyId={partyId}",
        success: function(data) {
          deferred.resolve(data);
        },
        failure: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchUserSegmentsDeferred;
    const fetchUserSegments = function(searchParams, deferred) {
      const options = {
        url: "segments?enterpriseRole={selectedUser}&status=ENABLED",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      listEnterpriseRoles: function() {
        listEnterpriseRolesDeferred = $.Deferred();
        listEnterpriseRoles(listEnterpriseRolesDeferred);

        return listEnterpriseRolesDeferred;
      },
      fetchPartyList: function(partyId) {
        fetchPartyListDeferred = $.Deferred();
        fetchPartyList(partyId, fetchPartyListDeferred);

        return fetchPartyListDeferred;
      },
      fetchUsersList: function(userId) {
        fetchUsersListDeferred = $.Deferred();
        fetchUsersList(userId, fetchUsersListDeferred);

        return fetchUsersListDeferred;
      },
      fetchUserSegments: function(searchParams) {
        fetchUserSegmentsDeferred = $.Deferred();
        fetchUserSegments(searchParams, fetchUserSegmentsDeferred);

        return fetchUserSegmentsDeferred;
      }
    };
  };

  return new CreateMailersModel();
});

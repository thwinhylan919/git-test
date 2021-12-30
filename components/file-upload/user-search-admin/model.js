define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UsersSearchAdminModel = function() {
    const baseService = BaseService.getInstance();
    let fetchUsersListDeferred;
    const fetchUsersList = function(Parameters, deferred) {
      const params = {
          username: Parameters.username,
          firstName: Parameters.firstName,
          lastName: Parameters.lastName,
          emailId: Parameters.emailId,
          mobileNumber: Parameters.mobileNumber,
          partyId: Parameters.partyId,
          isAccessSetupCheckRequired: false,
          userType: Parameters.userType
        },
        options = {
          url: "users?username={username}&firstName={firstName}&lastName={lastName}&mobileNumber={mobileNumber}&emailId={emailId}&userType={userType}&partyId={partyId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
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
    const listMappedUsers = function(deferred) {
      const options = {
        url: "fileUploads/parties/ADMIN/fileIdentifiers/userFileIdentifiersMappings",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchUsersList: function(Parameters) {
        fetchUsersListDeferred = $.Deferred();
        fetchUsersList(Parameters, fetchUsersListDeferred);

        return fetchUsersListDeferred;
      },
      listUsers: function(URL) {
        listUsersDeferred = $.Deferred();
        listUsers(listUsersDeferred, URL);

        return listUsersDeferred;
      },
      listMappedUsers: function() {
        listMappedUsersDeferred = $.Deferred();
        listMappedUsers(listMappedUsersDeferred);

        return listMappedUsersDeferred;
      }
    };
  };

  return new UsersSearchAdminModel();
});
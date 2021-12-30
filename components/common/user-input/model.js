define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the account-input component.
   *
   * @class UserDetailsModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   * @version Revision
   */
  const UserDetailsModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * This function uses baseService's fetch to GET list of all the demand deposit accounts.
     * @function fetchUserList
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let fetchUserListDeferred;
    const fetchUserList = function(partyId, deferred) {
      const options = {
        url: "users?partyId=" + partyId,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAdminUserListDeferred;
    const fetchAdminUserList = function(deferred) {
      const options = {
        url: "users?userGroup=Administrator",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAdminUserGroupListDeferred;
    const fetchAdminUserGroupList = function(userType, deferred) {
      const options = {
        url: "userGroups?partyId=&userGroupType={userType}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, {
        userType: userType
      });
    };
    let fetchUserGroupListDeferred;
    const fetchUserGroupList = function(partyId, userType, deferred) {
      const options = {
        url: "userGroups?partyId=" + partyId + "&userGroupType=" + userType,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchUserDetailsDeferred;
    const fetchUserDetails = function(userId, deferred) {
      const options = {
        url: "users/" + userId,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchUserList: function(partyId) {
        fetchUserListDeferred = $.Deferred();
        fetchUserList(partyId, fetchUserListDeferred);

        return fetchUserListDeferred;
      },
      fetchUserDetails: function(userId) {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(userId, fetchUserDetailsDeferred);

        return fetchUserDetailsDeferred;
      },
      fetchAdminUserList: function() {
        fetchAdminUserListDeferred = $.Deferred();
        fetchAdminUserList(fetchAdminUserListDeferred);

        return fetchAdminUserListDeferred;
      },
      fetchAdminUserGroupList: function(userType) {
        fetchAdminUserGroupListDeferred = $.Deferred();
        fetchAdminUserGroupList(userType, fetchAdminUserGroupListDeferred);

        return fetchAdminUserGroupListDeferred;
      },
      fetchUserGroupList: function(partyId, userType) {
        fetchUserGroupListDeferred = $.Deferred();
        fetchUserGroupList(partyId, userType, fetchUserGroupListDeferred);

        return fetchUserGroupListDeferred;
      }
    };
  };

  return new UserDetailsModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AuditLogModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Function to get new instance of ApplicationRolesCreateModel
     *
     * @function
     * @memberOf AuditLogModel
     * @returns Model
     */
    let fetchUsersListDeferred;
    const fetchUsersList = function(Parameters, deferred) {
      const params = {
          username: Parameters.username,
          partyId: Parameters.partyId,
          isAccessSetupCheckRequired: false,
          userType: Parameters.userType
        },
        options = {
          url: "users?firstName={username}&userType={userType}&partyId={partyId}",
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
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let fetchDetailsDeferred;
    const fetchDetails = function(partyId, deferred) {
      const param = {
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

      baseService.fetch(options, param);
    };
    /**
     * This function fires a GET request to fetch the user groups options
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchUserGroupOptions
     * @memberOf AuditLogModel
     * @example AuditLogModel.fetchUserGroupOptions();
     */
    let fetchUserGroupOptionsDeferred;
    const fetchUserGroupOptions = function(deferred) {
      const params = {
          isLocal: true
        },
        options = {
          url: "enterpriseRoles?isLocal={isLocal}",
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
     * @function fetchActivities
     * @memberOf AuditLogModel
     * @example AuditLogModel.fetchActivities();
     */
    let fetchActivitiesDeferred;
    const fetchActivities = function(deferred) {
      const options = {
        url: "resourceTasks?aspects=audit&view=list",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchPreferencePartyDeferrred;
    const fetchPreferenceForParty = function(partyID, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "parties/{partyId}/preferences",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let searchAuditDeferred;
    const searchAudit = function(username, fromdateTime, todateTime, activity, partyId, action, status, referenceNo, userType, deferred) {
      const params = {
        username: username,
        fromdateTime: fromdateTime,
        todateTime: todateTime,
        activity: activity,
        partyId: partyId,
        action: action,
        status: status,
        referenceNo: referenceNo,
        userType: userType
      },
      options = {
        url: "audit?userID={username}&startTime={fromdateTime}&endTime={todateTime}&activity={activity}&partyId={partyId}&action={action}&status={status}&referenceNo={referenceNo}&userType={userType}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options,params);
    };
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let fetchDetailsByNameDeferred;
    const fetchDetailsByName = function(partyName, deferred) {
      const params = {
        partyName: partyName
      },
      options = {
        url: "parties?fullName={partyName}",
        success: function(data) {
          deferred.resolve(data);
        },
        failure: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      fetchDetails: function(partyId) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(partyId, fetchDetailsDeferred);

        return fetchDetailsDeferred;
      },
      fetchUsersList: function(Parameters) {
        fetchUsersListDeferred = $.Deferred();
        fetchUsersList(Parameters, fetchUsersListDeferred);

        return fetchUsersListDeferred;
      },
      fetchDetailsByName: function(partyName) {
        fetchDetailsByNameDeferred = $.Deferred();
        fetchDetailsByName(partyName, fetchDetailsByNameDeferred);

        return fetchDetailsByNameDeferred;
      },
      fetchPreferenceForParty: function(partyID) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyID, fetchPreferencePartyDeferrred);

        return fetchPreferencePartyDeferrred;
      },
      searchAudit: function(username, fromdateTime, todateTime, activity, partyId, action, status, referenceNo, userType) {
        searchAuditDeferred = $.Deferred();
        searchAudit(username, fromdateTime, todateTime, activity, partyId, action, status, referenceNo, userType, searchAuditDeferred);

        return searchAuditDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

        return fetchUserGroupOptionsDeferred;
      },
      fetchActivities: function() {
        fetchActivitiesDeferred = $.Deferred();
        fetchActivities(fetchActivitiesDeferred);

        return fetchActivitiesDeferred;
      }
    };
  };

  return new AuditLogModel();
});
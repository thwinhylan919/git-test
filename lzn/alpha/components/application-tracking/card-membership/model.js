define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function CardMembershipModel() {
    const Model = function(modelData) {
        this.membershipDetails = {
          membershipNumber: modelData ? modelData.membershipNumber ? modelData.membershipNumber : "" : "",
          membershipName: modelData ? modelData.membershipName ? modelData.membershipName : "" : ""
        };
      },
      baseService = BaseService.getInstance();
    let readMembershipDetailsDeferred;
    const readMembershipDetails = function(submissionId, applicationId, deferred) {
      const options = {
        url: "submissions/{submissionId}/applications/{applicationId}/membership",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        submissionId: submissionId,
        applicationId: applicationId
      };

      baseService.fetch(options,params);
    };
    let updateMembershipDetailsDeferred;
    const updateMembershipDetails = function(submissionId, applicationId, payload, deferred) {
      const options = {
        url: "submissions/{submissionId}/applications/{applicationId}/membership",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        submissionId: submissionId,
        applicationId: applicationId
      };

      baseService.update(options, params);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readMembershipDetails: function(submissionId, applicationId) {
        readMembershipDetailsDeferred = $.Deferred();
        readMembershipDetails(submissionId, applicationId, readMembershipDetailsDeferred);

        return readMembershipDetailsDeferred;
      },
      updateMembershipDetails: function(submissionId, applicationId, payload) {
        updateMembershipDetailsDeferred = $.Deferred();
        updateMembershipDetails(submissionId, applicationId, payload, updateMembershipDetailsDeferred);

        return updateMembershipDetailsDeferred;
      }
    };
  };
});

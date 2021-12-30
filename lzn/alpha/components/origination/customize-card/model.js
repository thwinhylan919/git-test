define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function CardDetailsModel() {
    const
      baseService = BaseService.getInstance();
    let fetchAccountDetailsDeferred;
    const fetchAccountDetails = function(submissionId, facilityId, deferred) {
      const params = {
          submissionId: submissionId,
          facilityId: facilityId
        },
        options = {
          url: "submissions/{submissionId}/creditCardApplications/account?facilityId={facilityId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let createDiliveryPreferencesDeferred;
    const createDiliveryPreferences = function(submissionId, payload, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/creditCardApplications/account",
          data: JSON.stringify(payload),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };

    return {
      fetchAccountDetails: function(submissionId, facilityId) {
        fetchAccountDetailsDeferred = $.Deferred();
        fetchAccountDetails(submissionId, facilityId, fetchAccountDetailsDeferred);

        return fetchAccountDetailsDeferred;
      },
      createDiliveryPreferences: function(submissionId, payload) {
        createDiliveryPreferencesDeferred = $.Deferred();
        createDiliveryPreferences(submissionId, payload, createDiliveryPreferencesDeferred);

        return createDiliveryPreferencesDeferred;
      }
    };
  };
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function LoanAccountPreferenceModel() {
    const Model = function() {
      this.loanAccountPreference = {
        loanAccountAdditionalDetails: {
          statementFrequncy: "",
          redraw: true
        }
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let submissionId, applicantId,
      fetchEnumDeferred;
    const fetchEnum = function(deferred) {
      const options = {
        url: "enumerations/frequency?for=loanStatement",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAccountPreferenceDeferred;
    const fetchAccountPreference = function(deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans/preferences",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveAccountPreferenceDeferred;
    const saveAccountPreference = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans/preferences",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.update(options, params);
    };

    return {
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchEnum: function() {
        fetchEnumDeferred = $.Deferred();
        fetchEnum(fetchEnumDeferred);

        return fetchEnumDeferred;
      },
      fetchAccountPreference: function() {
        fetchAccountPreferenceDeferred = $.Deferred();
        fetchAccountPreference(fetchAccountPreferenceDeferred);

        return fetchAccountPreferenceDeferred;
      },
      saveAccountPreference: function(model) {
        saveAccountPreferenceDeferred = $.Deferred();
        saveAccountPreference(model, saveAccountPreferenceDeferred);

        return saveAccountPreferenceDeferred;
      }
    };
  };
});
define(["jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const accountSummary = function() {
    const baseService = BaseService.getInstance();
    let fetchAccountSummaryDeferred;
    const fetchAccountSummary = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchAccountSummary: function(submissionId, applicantId) {
        fetchAccountSummaryDeferred = $.Deferred();
        fetchAccountSummary(submissionId, applicantId, fetchAccountSummaryDeferred);

        return fetchAccountSummaryDeferred;
      }
    };
  };

  return new accountSummary();
});
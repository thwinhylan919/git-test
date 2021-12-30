define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    DisclosuresModel = function() {
      let getDisclosuresDeferred;
      const getDisclosures = function(submissionId, applicantId, deferred) {
        const params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/disclosures",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };

      return {
        getDisclosures: function(submissionId, applicantId) {
          getDisclosuresDeferred = $.Deferred();
          getDisclosures(submissionId, applicantId, getDisclosuresDeferred);

          return getDisclosuresDeferred;
        }
      };
    };

  return new DisclosuresModel();
});
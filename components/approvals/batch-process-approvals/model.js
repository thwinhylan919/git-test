define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BatchProcessApprovalModel = function() {
    let params;
    const baseService = BaseService.getInstance();
    let respondApprovalRequestDeferred;
    const respondApprovalRequest = function(transactionId, remarks, nature, ignore2FA, deferred) {
      params = {
        transactionId: transactionId,
        nature: nature
      };

      const options = {
        url: "transactions/{transactionId}/{nature}",
        contentType: "text/plain",
        data: remarks,
        headers: ignore2FA ? {
          "X-MULTIAPPROVAL": "true"
        } : {},
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(jqXhr, status, error) {
          if (this.ignore2FA) {
            deferred.reject(jqXhr, status, error);
          }
        }
      };

      baseService.add(options, params);
    };

    return {
      respondApprovalRequest: function(transactionId, remarks, nature, ignore2FA) {
        respondApprovalRequestDeferred = $.Deferred();
        respondApprovalRequest(transactionId, remarks, nature, ignore2FA, respondApprovalRequestDeferred);

        return respondApprovalRequestDeferred;
      }
    };
  };

  return new BatchProcessApprovalModel();
});
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ConfirmScreenModel = function() {
    const baseService = BaseService.getInstance();
    let downloadEreceiptDeferred;
    const downloadEreceipt = function(transactionId, deferred) {
      const params = {
          transactionId: transactionId
        },
        options = {
          url: "transactions/{transactionId}?media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.downloadFile(options, params);
    };

    return {
      downloadEreceipt: function(transactionId) {
        downloadEreceiptDeferred = $.Deferred();
        downloadEreceipt(transactionId, downloadEreceiptDeferred);

        return downloadEreceiptDeferred;
      },
      fetchTaskDetails: function(taskCode) {
        const options = {
          url: "resourceTasks/{taskCode}",
          showMessage: false
        };

        return baseService.fetch(options, {
          taskCode: taskCode
        });
      },
      fetchFeedbackTemplates: function(taskCode) {
        const options = {
          url: "feedback/template?roleIdentifier=Y&transactionId={taskCode}"
        };

        return baseService.fetch(options, {
          taskCode: taskCode
        });
      }
    };
  };

  return new ConfirmScreenModel();
});
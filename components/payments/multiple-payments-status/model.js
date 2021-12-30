define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MultiplePaymentsStatusModel = function() {
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
      }
    };
  };

  return new MultiplePaymentsStatusModel();
});
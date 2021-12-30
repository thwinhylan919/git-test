define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewAttachDocModel = function() {
      let getDocumentDeffered;
      const fetchDocumentsByteArray = function(documentUrl, deferred) {
        const params = {
            documentUrl: documentUrl,
            mediaType: "media",
            transactionType: "LC"
          },
          options = {
            url: "contents/{documentUrl}?transactionType={transactionType}&alt={mediaType}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.downloadFile(options, params);
      };

      return {
        fetchDocumentsByteArray: function(documentUrl) {
          getDocumentDeffered = $.Deferred();
          fetchDocumentsByteArray(documentUrl, getDocumentDeffered);

          return getDocumentDeffered;
        }
      };
    };

  return new ReviewAttachDocModel();
});
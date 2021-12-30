define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    AttachDocumentsModel = function () {
      let fetchCategoryDeferred;
      const fetchCategory = function (deferred) {
        const options = {
          url: "documentcontent/documentcategories",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let uploadDocumentDeferred;
      const uploadDocument = function (form, fileName, deferred) {
        const params = {
          fileName: fileName
        }, options = {
          url: "contents?fileName={fileName}",
          formData: form,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function () {
            deferred.reject();
          }
        };

        baseService.uploadFile(options, params);
      };
      let getDocumentDeffered;
      const fetchDocumentsByteArray = function (documentUrl, deferred) {
        const params = {
          documentUrl: documentUrl,
          mediaType: "media",
          transactionType: "LC"
        },
          options = {
            url: "contents/{documentUrl}?transactionType={transactionType}&alt={mediaType}",
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.downloadFile(options, params);
      };

      return {
        fetchCategory: function () {
          fetchCategoryDeferred = $.Deferred();
          fetchCategory(fetchCategoryDeferred);

          return fetchCategoryDeferred;
        },
        uploadDocument: function (form, fileName) {
          uploadDocumentDeferred = $.Deferred();
          uploadDocument(form, fileName, uploadDocumentDeferred);

          return uploadDocumentDeferred;
        },
        fetchDocumentsByteArray: function (documentUrl) {
          getDocumentDeffered = $.Deferred();
          fetchDocumentsByteArray(documentUrl, getDocumentDeffered);

          return getDocumentDeffered;
        }
      };
    };

  return new AttachDocumentsModel();
});
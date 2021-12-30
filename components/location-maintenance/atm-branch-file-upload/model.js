define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const LocationUploadModel = function() {
    const baseService = BaseService.getInstance();
    let uploadDocumentDeferred;
    const uploadDocument = function(file, type, deferred) {
        const form = new FormData();

        form.append("file", file);

        const options = {
          url: "locations/upload?type={ type}",
          formData: form,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

        baseService.uploadFile(options, type);
      },
      fetchPDF = function(recordId) {

        const options = {
          url: "locations/download/{recordId}?media=text/csv"
        };

        baseService.downloadFile(options, recordId);
      };

    return {
      uploadDocument: function(file, type) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(file, type, uploadDocumentDeferred);

        return uploadDocumentDeferred;
      },
      fetchPDF: function(recordId) {
        fetchPDF(recordId);
      }
    };
  };

  return new LocationUploadModel();
});
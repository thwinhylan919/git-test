define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const recordListingModel = function () {
    const baseService = BaseService.getInstance();
    let downloadFileDetailsDeferred;
    const downloadFileDetails = function (deferred, fileRefId, transactionType, searchParams, type) {
      let media, mediaFormat;

      if (type === "CSV") {
        media = "text/csv";
        mediaFormat = "csv";
      } else if (type === "PDF") {
        media = "application/pdf";
        mediaFormat = "pdf";
      }

      const options = {
        url: "fileUploads/files/{fileRefId}/records?transactionType={transactionType}" + searchParams + "&media={media}&mediaFormat={mediaFormat}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      },
        params = {
          fileRefId: fileRefId,
          media: media,
          mediaFormat: mediaFormat,
          transactionType: transactionType
        };

      baseService.downloadFile(options, params);
    };

    return {
      downloadFileDetails: function (fileRefId, transactionType, searchParams, type) {
        downloadFileDetailsDeferred = $.Deferred();
        downloadFileDetails(downloadFileDetailsDeferred, fileRefId, transactionType, searchParams, type);

        return downloadFileDetailsDeferred;
      }
    };
  };

  return new recordListingModel();
});
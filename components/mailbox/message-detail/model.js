define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MessageDetailModel = function() {
    const baseService = BaseService.getInstance();
    let replyMailDeferred;
    const replyMail = function(payload, linkedParentMessageId, deferred) {
      const params = {
          payload: payload,
          linkedParentMessageId: linkedParentMessageId
        },
        options = {
          url: "mailbox/mails/{linkedParentMessageId}/replyMail",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };
    let uploadDocumentDeferred;
    const uploadDocument = function(form, deferred) {
      const options = {
        url: "contents?transactionType=IM",
        selfLoader: true,
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function() {
          deferred.reject();
        }
      };

      baseService.uploadFile(options);
    };
    let deleteDocumentDeferred;
    const deleteDocument = function(contentId, deferred) {
      const params = {
          contentId: contentId
        },
        options = {
          url: "contents/{contentId}?transactionType=IM",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        };

      baseService.remove(options, params);
    };
    let downloadDocumentDeffered;
    const downloadDocument = function(contentId, deferred) {
      const params = {
          contentId: contentId,
          media: "media"
        },
        options = {
          url: "contents/{contentId}?alt={media}&transactionType=IM",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.downloadFile(options, params);
    };

    return {
      replyMail: function(payload, linkedParentMessageId) {
        replyMailDeferred = $.Deferred();
        replyMail(payload, linkedParentMessageId, replyMailDeferred);

        return replyMailDeferred;
      },
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);

        return uploadDocumentDeferred;
      },
      deleteDocument: function(contentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(contentId, deleteDocumentDeferred);

        return deleteDocumentDeferred;
      },
      downloadDocument: function(contentId) {
        downloadDocumentDeffered = $.Deferred();
        downloadDocument(contentId, downloadDocumentDeffered);

        return downloadDocumentDeffered;
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new MessageDetailModel();
});
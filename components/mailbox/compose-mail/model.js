define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ComposeMailModel = function() {
    const baseService = BaseService.getInstance();
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

    return {
      fetchCategoryOptions: function() {
        const options = {
          url: "mailCategories"
        };

        return baseService.fetch(options);
      },
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);

        return uploadDocumentDeferred;
      },
      fetchPartyOptions1: function() {
        const options = {
          url: "me/party"
        };

        return baseService.fetch(options);
      },
      fetchPartyOptions2: function() {
        const options = {
          url: "me/party/relations"
        };

        return baseService.fetch(options);
      },
      sendMail: function(payload) {
        const params = {
            payload: payload
          },
          options = {
            url: "mailbox/mails",
            data: payload
          };

        return baseService.add(options, params);
      },
      deleteDocument: function(contentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(contentId, deleteDocumentDeferred);

        return deleteDocumentDeferred;
      }
    };
  };

  return new ComposeMailModel();
});
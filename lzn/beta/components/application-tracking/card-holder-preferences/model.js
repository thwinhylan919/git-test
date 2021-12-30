define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";

    return function CardPreferenceModel() {
      const Model = function() {
          this.cardHolderPreferences = {};
        },
        baseService = BaseService.getInstance();
      let fetchBgContentIdsDeferred;
      const fetchBgContentIds = function(submissionId, payload, deferred) {
        const params = {
          submissionId:submissionId
        },
        options = {
          url: "submissions/{submissionId}/creditCardApplications/backGroundContent",
          data: JSON.stringify(payload),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.add(options, params);
      };
      let fetchSalutationsDeferred;
      const fetchSalutations = function(deferred) {
        const options = {
          url: "enumerations/salutation?for=primary",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchCardHolderPreferencesDeferred;
      const fetchCardHolderPreferences = function(submissionId, applicationId, deferred) {
        const params = {
          submissionId:submissionId,
          applicationId:applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/cardHolderPreferences",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options, params);
      };
      let updateCardHolderPreferencesDeferred;
      const updateCardHolderPreferences = function(submissionId, applicationId, payload, deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/cardHolderPreferences",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.update(options, params);
      };
      let getDocumentDeffered;
      const fetchDocumentsByteArray = function(documentUrl, ownerId, deferred) {
        const params = {
            documentUrl: documentUrl,
            mediaType: "media",
            ownerId: ownerId
          },
          options = {
            url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.downloadFile(options, params);
      };
      let getDocumentInfoDeffered;
      const getDocumentInfo = function(documentId, ownerId, deferred) {
        const params = {
            documentId: documentId,
            ownerId: ownerId
          },
          options = {
            url: "contents/{documentId}?ownerId={ownerId}&transactionType=OR",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let uploadDocumentDeferred;
      const uploadDocument = function(form, deferred) {
        const options = {
          url: "contents",
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.uploadFile(options);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        uploadDocument: function(form) {
          uploadDocumentDeferred = $.Deferred();
          uploadDocument(form, uploadDocumentDeferred);

          return uploadDocumentDeferred;
        },
        fetchBgContentIds: function(submissionId, payLoad) {
          fetchBgContentIdsDeferred = $.Deferred();
          fetchBgContentIds(submissionId, payLoad, fetchBgContentIdsDeferred);

          return fetchBgContentIdsDeferred;
        },
        updateCardHolderPreferences: function(submissionId, applicationId, payload) {
          updateCardHolderPreferencesDeferred = $.Deferred();
          updateCardHolderPreferences(submissionId, applicationId, payload, updateCardHolderPreferencesDeferred);

          return updateCardHolderPreferencesDeferred;
        },
        getSalutations: function() {
          fetchSalutationsDeferred = $.Deferred();
          fetchSalutations(fetchSalutationsDeferred);

          return fetchSalutationsDeferred;
        },
        fetchDocumentsByteArray: function(documentUrl, ownerId) {
          getDocumentDeffered = $.Deferred();
          fetchDocumentsByteArray(documentUrl, ownerId, getDocumentDeffered);

          return getDocumentDeffered;
        },
        getDocumentInfo: function(documentId, ownerId) {
          getDocumentInfoDeffered = $.Deferred();
          getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);

          return getDocumentInfoDeffered;
        },
        fetchCardHolderPreferences: function(submissionId, applicationId) {
          fetchCardHolderPreferencesDeferred = $.Deferred();
          fetchCardHolderPreferences(submissionId, applicationId, fetchCardHolderPreferencesDeferred);

          return fetchCardHolderPreferencesDeferred;
        }
      };
    };
  });

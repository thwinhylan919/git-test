define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for application offers section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationOffer~Model
   * @class ApplicationOfferModel
   */
  const ApplicationOfferModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let getDocumentsDeferred, fetchDocumentsByteArrayDeffered, offerStatusDeffered;
    const fetchOfferDocuments = function(submissionId, applicationId, deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/offerDocuments",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, params);
      },
      fetchDocumentsByteArray = function(documentUrl, deferred) {
        const params = {
            documentUrl: documentUrl,
            mediaType: "media"
          },
          options = {
            url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.downloadFile(options, params);
      };
    let appHistoryDeferred;
    const fetchApplicationHistory = function(submissionId, applicationId, deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/history",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, params);
      },
      sendOfferStatus = function(submissionId, applicationId, status, deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId,
            status: status
          },
        options = {
          showMessage: false,
          url: "submissions/{submissionId}/applications/{applicationId}/offers/{status}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.update(options, params);
      };

    return {
      fetchOfferDocuments: function(submissionId, applicationId) {
        getDocumentsDeferred = $.Deferred();
        fetchOfferDocuments(submissionId, applicationId, getDocumentsDeferred);

        return getDocumentsDeferred;
      },
      fetchDocumentsByteArray: function(documentUrl) {
        fetchDocumentsByteArrayDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, fetchDocumentsByteArrayDeffered);

        return fetchDocumentsByteArrayDeffered;
      },
      fetchApplicationHistory: function(submissionId, applicationId) {
        appHistoryDeferred = $.Deferred();
        fetchApplicationHistory(submissionId, applicationId, appHistoryDeferred);

        return appHistoryDeferred;
      },
      sendOfferStatus: function(submissionId, applicationId, status) {
        offerStatusDeffered = $.Deferred();
        sendOfferStatus(submissionId, applicationId, status, offerStatusDeffered);

        return offerStatusDeffered;
      }
    };
  };

  return new ApplicationOfferModel();
});

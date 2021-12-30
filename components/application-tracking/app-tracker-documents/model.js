define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  /**
   * Tech agnostic service for application documents. This file serves as the service for the application-documents component. It's job is to place rest api calls to the server, and firing the success handler, passed as an argument. It acts as a layer between the component model and the server. To make a rest api call, an option object is created, containing the submissionId, the applicationId, etc and the successHandler, and the call is made.
   *
   * @namespace {Function} ApplicationDocuments.service
   * @class ApplicationDocumentsService
   */
  const ApplicationDocumentsService = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let fetchDocumentChecklistDeferred;
    /**
     * Private method to get the document checklist to be uploaded by user in application form.
     * This method will only be called if submissionId, applicantId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchDocumentChecklist
     * @memberOf ApplicationDocumentsService
     * @param {string} submissionId - Submission id of the application.
     * @param {string} applicationId - Application id of the application.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchDocumentChecklist = function(submissionId, applicationId, deferred) {
      const params = {
        submissionId:submissionId,
        applicationId:applicationId
      },
     options = {
        url: "submissions/{submissionId}/applications/{applicationId}/documents",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options,params);
    };
    let uploadDocumentDeferred;
    /**
     * This function will upload a document to the server.
     * This method will only be called if form data containing file details is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function uploadDocument
     * @memberOf ApplicationDocumentsService
     * @param {Object} form - This is the object that contains the file and its details, to be uploaded.
     * @param {Object} deferred - Deferred object.
     * @returns {void}
     * @private
     */
    const uploadDocument = function(form, deferred) {
      const options = {
        url: "contents",
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
    let getDocumentDeffered;
    /**
     * Private method to download the file from server.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchDocumentsByteArray
     * @memberOf ApplicationDocumentsService
     * @param {string} documentUrl - Document reference id.
     * @param {string} ownerId - Applicant id of owner.
     * @param {string} applicationId - Application id.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchDocumentsByteArray = function(documentUrl, ownerId, applicationId, deferred) {
      const params = {
          documentUrl: documentUrl.value,
          mediaType: "media",
          ownerId: ownerId,
          applicationId: applicationId
        },
        options = {
          url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&applicationId={applicationId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.downloadFile(options, params);
    };

    return {
      /**
       * Public method to download the file from server.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchDocumentsByteArray
       * @memberOf ApplicationDocumentsService
       * @param {string} documentUrl - Document reference id.
       * @param {string} ownerId - Applicant id of owner.
       * @param {string} applicationId - Application id.
       * @param {Object} deferred - An object type Deferred.
       * @returns {Object} An object of type deferred.
       * @example
       * DocumentUploadModel.fetchDocumentsByteArray().then(function (data) {
       *
       * });
       */
      fetchDocumentsByteArray: function(documentUrl, ownerId, applicationId) {
        getDocumentDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, ownerId, applicationId, getDocumentDeffered);

        return getDocumentDeffered;
      },
      /**
       * Public method to get the document checklist to be uploaded by user in application form.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchDocumentChecklist
       * @memberOf ApplicationDocumentsService
       * @param {string} submissionId - Submission id of the application.
       * @param {string} applicationId - Application id of the application.
       * @returns {Object} An object of type deferred.
       * @example
       * DocumentUploadModel.fetchDocumentChecklist().then(function (data) {
       *
       * });
       */
      fetchDocumentChecklist: function(submissionId, applicationId) {
        fetchDocumentChecklistDeferred = $.Deferred();
        fetchDocumentChecklist(submissionId, applicationId, fetchDocumentChecklistDeferred);

        return fetchDocumentChecklistDeferred;
      },
      /**
       * Public method to upload the document.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function uploadDocument
       * @memberOf ApplicationDocumentsService
       * @param {Object} form - Form data containing the file details to be uploaded.
       * @returns {Object} An object of type deferred.
       * @example
       * DocumentUploadModel.uploadDocument().then(function (data) {
       *
       * });
       */
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);

        return uploadDocumentDeferred;
      }
    };
  };

  return new ApplicationDocumentsService();
});

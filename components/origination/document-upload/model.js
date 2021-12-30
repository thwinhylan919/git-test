define(["jquery", "baseService"], function ($, BaseService) {
  "use strict";

  /** This file serves as the service for the document-upload component. It's job is to place rest api calls to the server, and firing the success handler, passed as an argument. It acts as a layer between the component model and the server. To make a rest api call, an option object is created, containing the submissionId, the applicationId, etc and the successHandler, and the call is made.
   *
   * @namespace {Function} DocumentUpload.model
   * @class DocumentUploadModel
   */
  const DocumentUploadModel = function () {
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
     * @memberOf DocumentUploadModel
     * @param {String} submissionId - Submission id of the application
     * @param {String} applicantId Applicant id of the application
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * FetchDocumentChecklist - description.
     *
     * @param  {type} applicantId  - - - - - - - - - - - - - - - Description.
     * @param  {type} productcode  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchDocumentChecklist = function (applicantId, productcode, deferred) {
      const params = {
          ownerId: applicantId,
          productCode: productcode
        },
        options = {
          url: "documentcontent/documentcategories?productCode={productCode}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let uploadDocumentDeferred;
    /**
     * This function will upload a document to the server.
     * This method will only be called if form data containing file details is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function uploadDocument
     * @memberOf DocumentUploadModel
     * @param {Object} form - this is the object that contains the file and its details, to be uploaded
     * @param {Object} deferred - deferred object
     * @returns {void}
     * @private
     */
    /**
     * UploadDocument - description.
     *
     * @param  {type} form     - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const uploadDocument = function (form, deferred, fileName) {
      const params = {
          fileName: fileName
        },
        options = {
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
    let deleteDocumentDeferred;
    /**
     * This function will delete the document uploaded to the server.
     * This method will only be called if form data containing file details is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function deleteDocument
     * @memberOf DocumentUploadModel
     * @param {Object} contentId - document id of the document to be deleted
     * @param {Object} deferred - deferred object
     * @returns {void}
     * @private
     */
    /**
     * DeleteDocument - description.
     *
     * @param  {type} contentId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const deleteDocument = function (contentId, deferred) {
      const params = {
          contentId: contentId
        },
        options = {
          url: "contents/{contentId}?transactionType=OR",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function () {
            deferred.reject();
          }
        };

      baseService.remove(options, params);
    };
    let fetchUploadedDocumentsDeferred;
    /**
     * Private method to get the detailed list of uploaded documents.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchUploadedDocuments
     * @memberOf DocumentUploadModel
     * @param {String} submissionId - Submission id of the application
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * FetchUploadedDocuments - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchUploadedDocuments = function (submissionId, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/documents",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveDocumentDeferred;
    /**
     * Private method to save the document details on server.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function saveDocument
     * @memberOf DocumentUploadModel
     * @param {String} submissionId - Submission id of the application
     * @param {String} documentId - document id of the application
     * @param {Object} model payload to be sent in the request
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * SaveDocument - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - Description.
     * @param  {type} documentId   Description.
     * @param  {type} model        Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const saveDocument = function (submissionId, documentId, model, deferred) {
      const params = {
          submissionId: submissionId,
          documentId: documentId
        },
        options = {
          url: "submissions/{submissionId}/documents/{documentId}",
          data: model,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let deleteLocalDocumentDeferred;
    /**
     * Private method to delete the document details saved locally on server.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function deleteLocalDocument
     * @memberOf DocumentUploadModel
     * @param {String} submissionId - Submission id of the application
     * @param {String} documentId - document id of the application
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * DeleteLocalDocument - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} documentId   Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const deleteLocalDocument = function (submissionId, documentId, deferred) {
      const params = {
          submissionId: submissionId,
          documentId: documentId
        },
        options = {
          url: "submissions/{submissionId}/documents/{documentId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.remove(options, params);
    };
    let downloadDocumentDeffered;
    /**
     * Private method to download the file from server.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function downloadDocument
     * @memberOf DocumentUploadModel
     * @param {String} contentId - document reference id
     * @param {String} ownerId - applicant id of owner
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * DownloadDocument - description.
     *
     * @param  {type} contentId - - - - - - - - - - - - - - - Description.
     * @param  {type} ownerId   Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const downloadDocument = function (contentId, ownerId, deferred) {
      const params = {
          contentId: contentId,
          mediaType: "media",
          ownerId: ownerId
        },
        options = {
          url: "contents/{contentId}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.downloadFile(options, params);
    };

    return {
      /**
       * Public method to get the document checklist to be uploaded by user in application form.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchDocumentChecklist
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @param {String} applicantId Applicant id of the application
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.fetchDocumentChecklist().then(function (data) {
       *
       * });
       */
      /**
       * FetchDocumentChecklist - description.
       *
       * @param  {type} applicantId  - - - - - - - - - - - - - - - - Description.
       * @param  {type} productCode  Description.
       * @return {type}              Description.
       */
      fetchDocumentChecklist: function (applicantId, productCode) {
        fetchDocumentChecklistDeferred = $.Deferred();
        fetchDocumentChecklist(applicantId, productCode, fetchDocumentChecklistDeferred);

        return fetchDocumentChecklistDeferred;
      },
      /**
       * Public method to get the detailed list of uploaded documents.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchUploadedDocuments
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.fetchUploadedDocuments().then(function (data) {
       *
       * });
       */
      /**
       * FetchUploadedDocuments - description.
       *
       * @param  {type} submissionId - Description.
       * @return {type}              Description.
       */
      fetchUploadedDocuments: function (submissionId) {
        fetchUploadedDocumentsDeferred = $.Deferred();
        fetchUploadedDocuments(submissionId, fetchUploadedDocumentsDeferred);

        return fetchUploadedDocumentsDeferred;
      },
      /**
       * Public method to upload the document.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function uploadDocument
       * @memberOf DocumentUploadModel
       * @param {Object} form form data containing the file details to be uploaded
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.uploadDocument().then(function (data) {
       *
       * });
       */
      /**
       * UploadDocument - description.
       *
       * @param  {type} form - Description.
       * @return {type}      Description.
       */
      uploadDocument: function (form, fileName) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred, fileName);

        return uploadDocumentDeferred;
      },
      /**
       * Public method to delete the document.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteDocument
       * @memberOf DocumentUploadModel
       * @param {Object} contentId document id of the file to be deleted
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.deleteDocument().then(function (data) {
       *
       * });
       */
      /**
       * DeleteDocument - description.
       *
       * @param  {type} contentId - Description.
       * @return {type}           Description.
       */
      deleteDocument: function (contentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(contentId, deleteDocumentDeferred);

        return deleteDocumentDeferred;
      },
      /**
       * Public method to save the document details on server.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveDocument
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @param {String} documentId document id of the application
       * @param {Object} model payload to be sent in the request
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.saveDocument(submissionId, documentId, model).then(function (data) {
       *
       * });
       */
      /**
       * SaveDocument - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
       * @param  {type} documentId   Description.
       * @param  {type} model        Description.
       * @return {type}              Description.
       */
      saveDocument: function (submissionId, documentId, model) {
        saveDocumentDeferred = $.Deferred();
        saveDocument(submissionId, documentId, model, saveDocumentDeferred);

        return saveDocumentDeferred;
      },
      /**
       * Public method to delete the document details saved on server locally.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteLocalDocument
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @param {String} documentId document id of the application
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.deleteLocalDocument(submissionId, documentId).then(function (data) {
       *
       * });
       */
      /**
       * DeleteLocalDocument - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
       * @param  {type} documentId   Description.
       * @return {type}              Description.
       */
      deleteLocalDocument: function (submissionId, documentId) {
        deleteLocalDocumentDeferred = $.Deferred();
        deleteLocalDocument(submissionId, documentId, deleteLocalDocumentDeferred);

        return deleteLocalDocumentDeferred;
      },
      /**
       * Public method to download the file from server.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function downloadDocument
       * @memberOf DocumentUploadModel
       * @param {String} contentId document reference id
       * @param {String} ownerId applicant id of owner
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.downloadDocument().then(function (data) {
       *
       * });
       */
      /**
       * DownloadDocument - description.
       *
       * @param  {type} contentId - - - - - - - - - - - - - - - - Description.
       * @param  {type} ownerId   Description.
       * @return {type}           Description.
       */
      downloadDocument: function (contentId, ownerId) {
        downloadDocumentDeffered = $.Deferred();
        downloadDocument(contentId, ownerId, downloadDocumentDeffered);

        return downloadDocumentDeffered;
      }
    };
  };

  return new DocumentUploadModel();
});
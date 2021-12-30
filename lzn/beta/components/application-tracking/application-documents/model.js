define(["jquery", "baseService"], function ($, BaseService) {
  "use strict";

  /** Tech agnostic service for application documents. This file serves as the service for the application-documents component. It's job is to place rest api calls to the server, and firing the success handler, passed as an argument. It acts as a layer between the component model and the server. To make a rest api call, an option object is created, containing the submissionId, the applicationId, etc and the successHandler, and the call is made.
   *
   * @namespace {Function} ApplicationDocuments.service
   * @class ApplicationDocumentsService
   * @extends BaseService {@link BaseService}
   */
  const ApplicationDocumentsService = function () {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * This function will fetch and return the id and address documents list. It fires a rest api call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled.
     * @deprecated
     * @function fetchDocumentsList
     * @memberOf ApplicationDocumentsService
     * @param {function} successHandler - function fired after the data is recieved
     */
    let fetchDocumentsListDeferred;
    const fetchDocumentsList = function (successHandler, deferred) {
      const options = {
        url: "enumerations/identificationType",
        success: function (data) {
          successHandler(data);
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * This function will fetch and return the documents checklist. It fires a rest api call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled.
     * @function fetchDocumentChecklist
     * @memberOf ApplicationDocumentsService
     * @param {function} successHandler - function fired after the data is recived
     */
    let fetchDocumentChecklistDeferred;
    const fetchDocumentChecklist = function (submissionId, applicationId, deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/documents",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    /**
     * This function will upload a document to the server. Along with the document, it also passes a checklist id, which identifies the document as linked to a submission and an application id. It fires an ajax call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled.
     * @function uploadDocument
     * @memberOf ApplicationDocumentsService
     * @param {Object} form - this is the object that contains the file and its details, to be uploaded
     * @param {function} successHandler - function fired after the data is recieved
     * @param {function} errorHandler - function fired if there is an error contacting the server
     */
    let uploadDocumentDeferred;
    const uploadDocument = function (form, deferred) {
      const options = {
        url: "contents",
        selfLoader: true,
        formData: form,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function () {
          deferred.reject();
        }
      };

      baseService.uploadFile(options);
    };
    let getDocumentDeffered;
    const fetchDocumentsByteArray = function (documentUrl, ownerId, deferred) {
      const params = {
          documentUrl: documentUrl.value,
          mediaType: "media",
          ownerId: ownerId
        },
        options = {
          url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.downloadFile(options, params);
    };
    let getDocumentInfoDeffered;
    const getDocumentInfo = function (documentId, ownerId, deferred) {
      const params = {
          documentId: documentId,
          ownerId: ownerId
        },
        options = {
          url: "contents/{documentId}?ownerId={ownerId}&transactionType=OR",
          selfLoader: true,
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let deleteDocumentDeferred;
    const deleteDocument = function (documentId, deferred) {
      const params = {
          documentId: documentId
        },
        options = {
          url: "contents/{documentId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.remove(options, params);
    };

    return {
      fetchDocumentsList: function (successHandler) {
        fetchDocumentsListDeferred = $.Deferred();
        fetchDocumentsList(successHandler, fetchDocumentsListDeferred);

        return fetchDocumentsListDeferred;
      },
      fetchDocumentsByteArray: function (documentUrl, ownerId) {
        getDocumentDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, ownerId, getDocumentDeffered);

        return getDocumentDeffered;
      },
      getDocumentInfo: function (documentId, ownerId) {
        getDocumentInfoDeffered = $.Deferred();
        getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);

        return getDocumentInfoDeffered;
      },
      fetchDocumentChecklist: function (submissionId, applicationId) {
        fetchDocumentChecklistDeferred = $.Deferred();
        fetchDocumentChecklist(submissionId, applicationId, fetchDocumentChecklistDeferred);

        return fetchDocumentChecklistDeferred;
      },
      uploadDocument: function (form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);

        return uploadDocumentDeferred;
      },
      deleteDocument: function (documentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(documentId, deleteDocumentDeferred);

        return deleteDocumentDeferred;
      }
    };
  };

  return new ApplicationDocumentsService();
});
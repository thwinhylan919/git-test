define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        DocumentUploadrModel = function() {

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

            let getDocumentDeffered;
            const fetchDocumentsByteArray = function(documentUrl, deferred) {
                const params = {
                        documentUrl: documentUrl,
                        moduleIdentifier: "CREDIT_FACILITY",
                        transactionType: "MO"
                    },
                    options = {
                        url: "contents/{documentUrl}?transactionType={transactionType}&alt={mediaType}",
                        success: function(data) {
                            deferred.resolve(data);
                        }
                    };

                baseService.downloadFile(options, params);
            };

            let getDocumentDetailsDeffered;
            const fetchDocumentsDetails = function(contentId, deferred) {
                const params = {
                        contentId: contentId,
                        moduleIdentifier: "CREDIT_FACILITY",
                        transactionType: "MO"
                    },
                    options = {
                        url: "contents/{contentId}?transactionType={transactionType}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    };

                baseService.fetch(options, params);
            };

            return {
                uploadDocument: function(form) {
                    uploadDocumentDeferred = $.Deferred();
                    uploadDocument(form, uploadDocumentDeferred);

                    return uploadDocumentDeferred;
                },
                getDocumentList: function(processCode, stageCode, applicationCategoryCode) {
                    return baseService.fetch({
                        url: "creditFacilities/documents?processCode={processCode}&stageCode={stageCode}&applicationCategoryCode={applicationCategoryCode}"
                    }, {
                        processCode: processCode,
                        stageCode: stageCode,
                        applicationCategoryCode: applicationCategoryCode

                    });
                },
                fetchDocumentsByteArray: function(documentUrl) {
                    getDocumentDeffered = $.Deferred();
                    fetchDocumentsByteArray(documentUrl, getDocumentDeffered);

                    return getDocumentDeffered;
                },
                fetchDocumentsDetails: function(contentId) {
                    getDocumentDetailsDeffered = $.Deferred();
                    fetchDocumentsDetails(contentId, getDocumentDetailsDeffered);

                    return getDocumentDetailsDeffered;
                }
            };
        };

    return new DocumentUploadrModel();
});
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const fileUploadViewModel = function() {
        const baseService = BaseService.getInstance();
        let listBTIdDeferred;
        const listBTId = function(deferred) {
            const options = {
                url: "fileUploads/userFileIdentifiersMappings",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let getTransactionTypesDeferred;
        const getTransactionTypes = function(deferred) {
            const options = {
                url: "enumerations/transactionTypes",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let getApprovalTypesDeferred;
        const getApprovalTypes = function(deferred) {
            const options = {
                url: "enumerations/approvalTypes",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let getAccountingTypesDeferred;
        const getAccountingTypes = function(deferred) {
            const options = {
                url: "enumerations/accountingTypes",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let getFileFormatTypesDeferred;
        const getFileFormatTypes = function(deferred) {
            const options = {
                url: "enumerations/formatTypes",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let uploadDocumentDeferred;
        const uploadDocument = function(btId, file, deferred) {
            const form = new FormData();

            form.append("file", file);
            form.append("FI", btId);

            const options = {
                url: "fileUploads/files",
                formData: form,
                type: "POST",
                success: function(data, status, jqXHR) {
                    deferred.resolve(data, status, jqXHR);
                },
                error: function(data, status, jqXHR) {
                    deferred.reject(data, status, jqXHR);
                }
            };

            baseService.uploadFile(options);
        };

        return {
            listBTId: function() {
                listBTIdDeferred = $.Deferred();
                listBTId(listBTIdDeferred);

                return listBTIdDeferred;
            },
            getApprovalTypes: function() {
                getApprovalTypesDeferred = $.Deferred();
                getApprovalTypes(getApprovalTypesDeferred);

                return getApprovalTypesDeferred;
            },
            getFileFormatTypes: function() {
                getFileFormatTypesDeferred = $.Deferred();
                getFileFormatTypes(getFileFormatTypesDeferred);

                return getFileFormatTypesDeferred;
            },
            getAccountingTypes: function() {
                getAccountingTypesDeferred = $.Deferred();
                getAccountingTypes(getAccountingTypesDeferred);

                return getAccountingTypesDeferred;
            },
            getTransactionTypes: function() {
                getTransactionTypesDeferred = $.Deferred();
                getTransactionTypes(getTransactionTypesDeferred);

                return getTransactionTypesDeferred;
            },
            uploadDocument: function(btId, file) {
                uploadDocumentDeferred = $.Deferred();
                uploadDocument(btId, file, uploadDocumentDeferred);

                return uploadDocumentDeferred;
            }
        };
    };

    return new fileUploadViewModel();
});
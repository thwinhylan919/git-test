define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const DocumentUploadrModel = function () {
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.applicantDetailsDocument = {
                    documentName: null,
                    documentType: null,
                    documentLinkageId: null
                };
            };

        this.getNewModel = function () {
            return new this.Model();
        };

        let fetchDatasegmentDeferred;
        const fetchDatasegment = function (deferred, productCode) {
            const options = {
                    url: "v1/obclpm/listDataSegments/{productCode}/LoanOrig?includeStageInfo=true",
                    version: "ext",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    productCode: productCode
                };

            baseService.fetch(options, params);
        };
        let documentUploadServiceDeferred;
        const documentUploadService = function (RequiredFileUpload, deferred) {
            const form = new FormData();

            form.append("file", RequiredFileUpload);
            form.append("transactionType", "MO");
            form.append("fileCount", 1);

            const options = {
                url: "contents?local=en",
                formData: form,
                success: function (data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function (data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.uploadFile(options);
        };

        return {
            getNewModel: function (modelData) {
                return new Model(modelData);
            },

            fetchDatasegment: function (productCode) {
                fetchDatasegmentDeferred = $.Deferred();
                fetchDatasegment(fetchDatasegmentDeferred, productCode);

                return fetchDatasegmentDeferred;
            },

            documentUploadService: function (RequiredFileUpload) {
                documentUploadServiceDeferred = $.Deferred();
                documentUploadService(RequiredFileUpload, documentUploadServiceDeferred);

                return documentUploadServiceDeferred;
            }
        };
    };

    return new DocumentUploadrModel();
});
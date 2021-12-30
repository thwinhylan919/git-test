define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function contentscontentIddeleteCall(contentId, transactionType, payload, config) {
            return Model.contentscontentIddelete(contentId, transactionType, payload, config);
        }

                function contentspostCall(payload, config) {
            return Model.contentspost(payload, config);
        }

                function creditFacilitiesdocumentsgetCall(processCode, applicationCategoryCode, stageCode, payload, config) {
            return Model.creditFacilitiesdocumentsget(processCode, applicationCategoryCode, stageCode, payload, config);
        }

                function onClickUpload78(event, data) {
            const files = event.detail.files[0];

            self.document.attachedDocuments()[self.documentsListMap[data.id]].fileName(files.name);

            const formData = new FormData();

            formData.append("file", files);
            formData.append("transactionType", "MO");
            formData.append("moduleIdentifier", "CREDIT_FACILITY");
            formData.append("fileCount", 1);

            contentspostCall(formData).then(function (response) {
                if (response.contentDTOList.length && response.contentDTOList[0] && response.contentDTOList[0].contentId) {
                    self.document.attachedDocuments()[self.documentsListMap[data.id]].contentId.value(response.contentDTOList[0].contentId.value);
                }
            });
        }

                function onClickRemove40(data) {
            contentscontentIddeleteCall(data.contentId.value(), "MO").then(function () {
                data.fileName(null);
                data.contentId.value(null);
            });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.review = params.review;
            self.collateralDocumentsUploadTracker = ko.observable();

            self.document = {
                processId: params.documentMode !== "Facility" ? "COPS" : "CAMS",
                stageId: params.documentMode !== "Facility" ? "CPM_FA_COPS_INITI" : "CFPM_FA_CAM_INIT",
                attachedDocuments: ko.observableArray([])
            };

            self.document2 = {
                processId: params.documentMode !== "Facility" ? "COPS" : "CAMS",
                stageId: params.documentMode !== "Facility" ? "CPM_FA_COPS_INITI" : "CFPM_FA_CAM_INIT",
                attachedDocuments: ko.observableArray([])
            };

            self.document1 = {
                processId: params.documentMode !== "Facility" ? "COPS" : "CAMS",
                stageId: params.documentMode !== "Facility" ? "CPM_FA_COPS_INITI" : "CFPM_FA_CAM_INIT",
                attachedDocuments: ko.observableArray([])
            };

            self.applicationDocCode = params.documentMode !== "Facility" ? "Perfection" : "CreditApp";
            self.documentsListMap = {};
            ko.utils.extend(self, params.payload);
            ko.utils.extend(params.payload, { document: self.document });

            creditFacilitiesdocumentsgetCall(ko.utils.unwrapObservable(self.document.processId), ko.utils.unwrapObservable(self.applicationDocCode), ko.utils.unwrapObservable(self.document.stageId)).then(function (response) {
                let count = 0;

                ko.utils.arrayForEach(response.document && response.document.documentsList, function (item) {
                    if (self.document.attachedDocuments().length !== response.document.documentsList.length || self.review) {
                        let content;

                        if (self.document.attachedDocuments() && self.document.attachedDocuments().length > 0) {
                            content = ko.utils.arrayFirst(self.document.attachedDocuments(), function (element) {
                                return element.id === item.id;
                            });
                        }

                        const obj = {
                            id: item.id,
                            description: item.description,
                            name: item.name,
                            fileName: ko.observable(content && content.fileName ? content.fileName() : null),
                            contentId: { value: ko.observable() }
                        };

                        if (self.review) {
                            if (response.document.documentsList.length >= 2) {
                                if (count < parseInt(response.document.documentsList.length / 2)) {
                                    self.document1.attachedDocuments.push(obj);
                                } else {
                                    self.document2.attachedDocuments.push(obj);
                                }
                            } else {
                                self.document1.attachedDocuments.push(obj);
                            }
                        } else {
                            self.document.attachedDocuments.push(obj);
                        }
                    }

                    count++;
                    self.documentsListMap[item.id] = Object.keys(self.documentsListMap).length;
                });
            });

            if (params.review && params.rootModel.productData().productId === "facilityAmend") {
                params.dashboard.headerName(self.nls.amendFacilityHeader);
            } else if (params.review && params.rootModel.productData().productId === "facility") {
                params.dashboard.headerName(self.nls.newFacilityHeader);
            } else if (params.review && params.rootModel.productData().productId === "collateralEvaluation") {
                params.dashboard.headerName(self.nls.collaterEvaluationHeader);
            }

            params.rootModel.successHandler = function () {
                return new Promise(function (resolve) {
                    if (params.baseModel.showComponentValidationErrors(document.getElementById("collateralDocumentsUploadTracker"))) {
                        resolve();
                    }
                });
            };

            return true;
        }

        return {
            contentscontentIddeleteCall: contentscontentIddeleteCall,
            contentspostCall: contentspostCall,
            creditFacilitiesdocumentsgetCall: creditFacilitiesdocumentsgetCall,
            onClickUpload78: onClickUpload78,
            onClickRemove40: onClickRemove40,
            init: init
        };
    };
});
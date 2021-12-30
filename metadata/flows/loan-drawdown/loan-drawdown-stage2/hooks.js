define([
    "./model",
    "knockout",
    "jquery"
], function (Model, ko, $) {
    "use strict";

    return function () {
        let self;

                function contentspostCall(payload, config) {
            return Model.contentspost(payload, config);
        }

                function contentscontentIddeleteCall(contentId, transactionType, payload, config) {
            return Model.contentscontentIddelete(contentId, transactionType, payload, config);
        }

                function processManagementpostCall(payload, config) {
            return Model.processManagementpost(payload, config);
        }

                function mepartygetCall(payload, config) {
            return Model.mepartyget(payload, config);
        }

                function purposesmoduleTypegetCall(moduleType, payload, config) {
            return Model.purposesmoduleTypeget(moduleType, payload, config);
        }

                function productsloangetCall(payload, config) {
            return Model.productsloanget(payload, config);
        }

                function productsloanproductCodesegmentsgetCall(productCode, payload, config) {
            return Model.productsloanproductCodesegmentsget(productCode, payload, config);
        }

                function contentscontentIdgetCall(contentId, alt, ownerId, applicationId, transactionType, toBeDownloaded, payload, config) {
            return Model.contentscontentIdget(contentId, alt, ownerId, applicationId, transactionType, toBeDownloaded, payload, config);
        }

                function liabilitiesgetCall(partyId, payload, config) {
            return Model.liabilitiesget(partyId, payload, config);
        }

                function onClickUpload60(event, data) {
            const files = event.detail.files[0];

            if (self.validateFile(files)) {
                const formData = new FormData();

                formData.append("file", files);
                formData.append("transactionType", "MO");
                formData.append("moduleIdentifier", "LOAN");
                formData.append("fileCount", 1);

                contentspostCall(formData).then(function (response) {
                    if (response.contentDTOList.length && response.contentDTOList[0] && response.contentDTOList[0].contentId) {
                        self.document.attachedDocuments()[self.documentsListMap[data.id]].fileName(files.name);
                        self.document.attachedDocuments()[self.documentsListMap[data.id]].documentType(files.name.split(/[\.]/)[1]);
                        self.document.attachedDocuments()[self.documentsListMap[data.id]].contentId(response.contentDTOList[0].contentId);
                    }
                });
            }
        }

                function onClickRemove26(data) {
            contentscontentIddeleteCall(data.contentId().value, "MO").then(function () {
                data.fileName(null);
                data.contentId(null);
            });
        }

        function init(bindingContext, _rootParams) {
            self = bindingContext;
            self.collateralDocumentsUploadTracker = ko.observable();

            self.fileTypeArray = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "application/pdf",
                "application/msword",
                "text/plain",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ];

            self.document = self.getStageState("loan-drawdown-stage2") && self.getStageState("loan-drawdown-stage2").document ? self.getStageState("loan-drawdown-stage2").document : { attachedDocuments: ko.observableArray([]) };
            self.documentsListMap = self.getStageState("loan-drawdown-stage2") && self.getStageState("loan-drawdown-stage2").documentsListMap ? self.getStageState("loan-drawdown-stage2").documentsListMap : {};

            if (!self.getStageState("loan-drawdown-stage2")) {
                productsloanproductCodesegmentsgetCall(self.getStageState("loan-drawdown-stage1").payload.applicationDetails.productCode).then(function (response) {
                    self.payload.applicationDetails.lifeCycleCode(response.segmentDTO.lifeCycleCode);

                    ko.utils.arrayForEach(response.segmentDTO.stages[0].documentsList, function (item) {
                        if (self.document.attachedDocuments().length !== response.segmentDTO.stages[0].documentsList) {
                            let content;

                            if (self.getStageState("loan-drawdown-stage1").data) {
                                self.payload.applicantOtherDetails.documentsList = ko.mapping.fromJS(self.getStageState("loan-drawdown-stage1").data.applicantOtherDetails.documentsList);
                            }

                            if (self.payload.applicantOtherDetails.documentsList()) {
                                content = ko.utils.arrayFirst(self.payload.applicantOtherDetails.documentsList(), function (element) {
                                    return element.id() === item.documentName;
                                });
                            }

                            if (content) {
                                const obj = {
                                    id: content.id(),
                                    description: content.description(),
                                    name: content.documentName(),
                                    fileName: ko.observable(content.documentName() + "." + content.documentType()),
                                    contentId: ko.observable(ko.mapping.toJS(content.documentId)),
                                    documentType: ko.observable(content.documentType())
                                };

                                self.document.attachedDocuments.push(obj);
                            } else {
                                self.document.attachedDocuments.push({
                                    id: item.documentName,
                                    description: item.documentType,
                                    name: item.documentType,
                                    fileName: ko.observable(),
                                    contentId: ko.observable(),
                                    documentType: ko.observable()
                                });
                            }
                        }

                        self.documentsListMap[item.documentName] = Object.keys(self.documentsListMap).length;
                    });
                });

                mepartygetCall(self.mepartygetVar()).then(function (response) {
                    self.payload.applicationDetails.customerName(response.party.personalDetails.fullName);
                    self.payload.applicationDetails.name(response.party.personalDetails.fullName);
                    self.payload.applicantOtherDetails.customerName(response.party.personalDetails.fullName);
                    self.payload.applicationDetails.customerNumber = response.party.id;
                    self.payload.applicationDetails.email(response.party.personalDetails.email);
                });
            } else {
                self.payload = ko.mapping.fromJS(self.getStageState("loan-drawdown-stage2").payload);
            }

            self.draftName = ko.observable();

            self.validateFile = function (files) {
                if (!(self.fileTypeArray.indexOf(files.type) > -1)) {
                    _rootParams.baseModel.showMessages(null, [self.nls.fileTypeError], "ERROR");

                    return false;
                }

                if (files.size <= 0) {
                    _rootParams.baseModel.showMessages(null, [self.nls.emptyFileErrorMsg], "ERROR");

                    return false;
                } else if (files.size > 1000000) {
                    _rootParams.baseModel.showMessages(null, [self.nls.fileSizeErrorMsg], "ERROR");

                    return false;
                }

                return true;
            };

            self.closeHandler = function () {
                $("#saveDraftModal").trigger("closeModal");
                self.draftName("");
            };

            self.openDraftModal = function () {
                $("#saveDraftModal").trigger("openModal");
            };

            self.getConfirmScreenDraftMessage = function () {
                return self.nls.draftSuccessMessage;
            };

            self.saveDraftData = function () {
                if (!_rootParams.baseModel.showComponentValidationErrors(document.getElementById("draftTracker"))) {
                    return false;
                }

                for (let m = 0; m < self.document.attachedDocuments().length; m++) {
                    if (self.document.attachedDocuments()[m].fileName()) {
                        self.payload.applicantOtherDetails.documentsList.push({
                            documentName: self.document.attachedDocuments()[m].fileName().split(/[\.]/)[0],
                            documentType: self.document.attachedDocuments()[m].documentType(),
                            documentId: self.document.attachedDocuments()[m].contentId(),
                            id: self.document.attachedDocuments()[m].id,
                            description: self.document.attachedDocuments()[m].description
                        });
                    }
                }

                self.processManagementpostv1payload = Model.getNewModel().processManagementpostv1payload;
                self.processManagementpostv1payload.payload = {};
                self.processManagementpostv1payload.payload.json = ko.mapping.toJS(self.payload);
                self.processManagementpostv1payload.payload.json.applicationDetails.productCode = self.getStageState("loan-drawdown-stage1").payload.applicationDetails.productCode;
                self.processManagementpostv1payload.payload.json.applicationDetails.purposeText = self.getStageState("loan-drawdown-stage1").payload.applicationDetails.purposeText;
                self.processManagementpostv1payload.payload.json.applicationDetails.facilityDTO = self.getStageState("loan-drawdown-stage1").payload.applicationDetails.facilityDTO;
                self.processManagementpostv1payload.payload.json.loanRequirements = self.getStageState("loan-drawdown-stage1").payload.loanRequirements;
                self.processManagementpostv1payload.payload.typeOf = "GenericAppicationDetailsDTO";
                self.processManagementpostv1payload.moduleId = "OBCLPM";
                self.processManagementpostv1payload.draftName = self.draftName();
                self.processManagementpostv1payload.partyId = self.getStageState("loan-drawdown-stage1").facilityDetails.partyId;
                self.processManagementpostv1payload.type = "Loan Drawdown";
                self.processManagementpostv1payload.status = "DRAFT";

                processManagementpostCall(ko.toJSON(self.processManagementpostv1payload)).then(function (response) {
                    _rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: response,
                        transactionName: self.nls.componentHeader,
                        confirmScreenExtensions: {
                            isSet: true,
                            confirmScreenMsgEval: self.getConfirmScreenDraftMessage,
                            template: "confirm-screen/loan-drawdown-template"
                        },
                        draftReference: {
                            label: self.nls.referenceNumber,
                            number: response.processManagementDTO.refId ? response.processManagementDTO.refId : null
                        },
                        resource: self.nls
                    });
                });
            };

            self.openDraftModal = function () {
                $("#saveDraftModal").trigger("openModal");
            };

            self.pageRendered = function () {
                return true;
            };

            _rootParams.baseModel.registerComponent("loan-drawdown-documents-upload", "loans");

            return true;
        }

        return {
            contentspostCall: contentspostCall,
            contentscontentIddeleteCall: contentscontentIddeleteCall,
            processManagementpostCall: processManagementpostCall,
            mepartygetCall: mepartygetCall,
            purposesmoduleTypegetCall: purposesmoduleTypegetCall,
            productsloangetCall: productsloangetCall,
            productsloanproductCodesegmentsgetCall: productsloanproductCodesegmentsgetCall,
            contentscontentIdgetCall: contentscontentIdgetCall,
            liabilitiesgetCall: liabilitiesgetCall,
            onClickUpload60: onClickUpload60,
            onClickRemove26: onClickRemove26,
            init: init
        };
    };
});
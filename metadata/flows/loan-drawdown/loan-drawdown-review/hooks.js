define([
    "./model",
    "jquery",
    "knockout"
], function (Model, $, ko) {
    "use strict";

    return function () {
        let self;

                function liabilitiesliabilityIdfacilitiesIdgetCall(Id, liabilityId, payload, config) {
            return Model.liabilitiesliabilityIdfacilitiesIdget(Id, liabilityId, payload, config);
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

                function processManagementrefIddeleteCall(refId, payload, config) {
            return Model.processManagementrefIddelete(refId, payload, config);
        }

                function loanApplicationspostCall(payload, config) {
            return Model.loanApplicationspost(payload, config);
        }

                function onClickOk72() {
            self.closeHandler();
        }

                function onClickTermsandconditions46() {
            $("#termsConditions").trigger("openModal");
        }

                function onClickBack74() {
            self.back();
        }

        function init(bindingContext, _rootParams) {
            self = bindingContext;

            self.pageRendered = function () {
                return true;
            };

            _rootParams.baseModel.registerComponent("loan-facility-details", "loans");
            self.year = ko.observable(parseInt(self.payload.loanRequirements.tenure / 12));
            self.month = ko.observable(self.payload.loanRequirements.tenure % 12);

            self.tenure = ko.observable(_rootParams.baseModel.format(self.nls.tenure, {
                year: parseInt(self.payload.loanRequirements.tenure / 12),
                month: self.payload.loanRequirements.tenure % 12
            }));

            self.back = function () {
                _rootParams.dashboard.hideDetails();
            };

            self.closeHandler = function () {
                $("#termsConditions").hide();
            };

            self.isTermSelected = ko.observableArray();
            self.document = { attachedDocuments: ko.observableArray([]) };
            self.document1 = { attachedDocuments: ko.observableArray([]) };
            self.documentsListMap = {};
            self.facilityDetails = ko.observable();
            self.product = ko.observable();
            self.purposeText = ko.observable();

            self.loadConfirmScreen = function (response) {
                _rootParams.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: response,
                    transactionName: self.nls.transactionName,
                    hostReferenceNumber: response.applicationDTO && response.applicationDTO.externalReferenceId ? response.applicationDTO.externalReferenceId : null,
                    confirmScreenExtensions: {
                        isSet: true,
                        confirmScreenMsgEval: self.getConfirmScreenTransactionMessage,
                        confirmScreenStatusEval: self.getConfirmScreenTransactionStatus,
                        fromApproval: false,
                        template: "confirm-screen/loan-drawdown-template"
                    },
                    resource: self.nls
                });
            };

            self.getConfirmScreenMsg = function (jqXHR) {
                if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                    return self.nls.confirmScreen.approvalMessages.FAILED.successmsg;
                } else if (jqXHR.responseJSON.transactionAction) {
                    return self.nls.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
                }
            };

            self.getConfirmScreenStatus = function (jqXHR) {
                if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                    return self.nls.confirmScreen.approvalMessages.FAILED.statusmsg;
                } else if (jqXHR.responseJSON.transactionAction) {
                    return self.nls.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
                }
            };

            self.getConfirmScreenTransactionMessage = function (jqXHR) {
                if (jqXHR.getResponseStatus() === 202) {
                    return self.nls.confirmScreen.approvalMessages.Initiated.successmsg;
                } else if (jqXHR.getResponseStatus() === 201) {
                    return self.nls.confirmScreen.approvalMessages.Completed.successmsg;
                }
            };

            self.getConfirmScreenTransactionStatus = function (jqXHR) {
                if (jqXHR.getResponseStatus() === 202) {
                    return self.nls.confirmScreen.approvalMessages.Initiated.statusmsg;
                } else if (jqXHR.getResponseStatus() === 201) {
                    return self.nls.confirmScreen.approvalMessages.Completed.statusmsg;
                }
            };

            if (self.getStageState("loan-drawdown-review").rawApprovalData && self.getStageState("loan-drawdown-review").rawApprovalData.confirmScreenExtensions) {
                $.extend(self.getStageState("loan-drawdown-review").rawApprovalData.confirmScreenExtensions, {
                    isSet: true,
                    template: "confirm-screen/loan-drawdown-template",
                    fromApproval: true,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus
                });
            }

            productsloanproductCodesegmentsgetCall(self.getStageState("loan-drawdown-review").payload.applicationDetails.productCode).then(function (response) {
                let count = 0;

                ko.utils.arrayForEach(response.segmentDTO.stages[0].documentsList, function (item) {
                    if (self.document.attachedDocuments().length !== response.segmentDTO.stages[0].documentsList) {
                        let content;

                        if (self.payload.applicantOtherDetails && self.payload.applicantOtherDetails.documentsList && self.payload.applicantOtherDetails.documentsList.length > 0) {
                            content = ko.utils.arrayFirst(self.payload.applicantOtherDetails.documentsList, function (element) {
                                return element.id === item.documentName;
                            });
                        }

                        if (content) {
                            const obj = {
                                id: content.id,
                                description: content.description,
                                name: content.documentName,
                                fileName: ko.observable(content.documentName + "." + content.documentType),
                                contentId: ko.observable(ko.mapping.toJS(content.documentId)),
                                documentType: ko.observable(content.documentType)
                            };

                            if (count < parseInt(response.segmentDTO.stages[0].documentsList.length / 2)) {
                                self.document.attachedDocuments.push(obj);
                            } else {
                                self.document1.attachedDocuments.push(obj);
                            }
                        } else if (count < parseInt(response.segmentDTO.stages[0].documentsList.length / 2)) {
                            self.document.attachedDocuments.push({
                                id: item.documentName,
                                description: item.documentType,
                                name: item.documentType,
                                fileName: ko.observable(),
                                contentId: ko.observable(),
                                documentType: ko.observable()
                            });
                        } else {
                            self.document1.attachedDocuments.push({
                                id: item.documentName,
                                description: item.documentType,
                                name: item.documentType,
                                fileName: ko.observable(),
                                contentId: ko.observable(),
                                documentType: ko.observable()
                            });
                        }
                    }

                    count++;
                    self.documentsListMap[item.documentName] = Object.keys(self.documentsListMap).length;
                });
            });

            Promise.all([
                liabilitiesliabilityIdfacilitiesIdgetCall(self.payload.applicationDetails.facilityDTO[0].liabilityId, self.payload.applicationDetails.facilityDTO[0].id),
                productsloangetCall(),
                purposesmoduleTypegetCall("LN")
            ]).then(function (response) {
                self.facilityDetails(response[0].facilityDTO);
                self.facilityDetails().lineCodeNew = self.facilityDetails().lineCode + "_" + self.facilityDetails().lineSerialNumber;

                self.product(ko.utils.arrayFirst(response[1].loanAccountDetails, function (element) {
                    return element.name === self.payload.applicationDetails.productCode;
                }).description);

                self.purposeText(ko.utils.arrayFirst(response[2].purposeList, function (element) {
                    return element.code === self.payload.applicationDetails.purposeText;
                }).description);
            });

            return true;
        }

        return {
            liabilitiesliabilityIdfacilitiesIdgetCall: liabilitiesliabilityIdfacilitiesIdgetCall,
            purposesmoduleTypegetCall: purposesmoduleTypegetCall,
            productsloangetCall: productsloangetCall,
            productsloanproductCodesegmentsgetCall: productsloanproductCodesegmentsgetCall,
            processManagementrefIddeleteCall: processManagementrefIddeleteCall,
            loanApplicationspostCall: loanApplicationspostCall,
            onClickOk72: onClickOk72,
            onClickTermsandconditions46: onClickTermsandconditions46,
            onClickBack74: onClickBack74,
            init: init
        };
    };
});
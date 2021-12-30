define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/issue-demand-draft",
    "ojs/ojknockout",
    "ojs/ojavatar"
], function(oj, ko, $, draftModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.payments.common;
        self.paymentType = ko.observable();
        self.details = ko.observable(rootParams.data);
        self.stageTwo = ko.observable(false);
        self.transferNow = ko.observable(true);
        self.mode = ko.observable();
        self.paymentId = ko.observable();
        self.demandDraftPayment = ko.observable();
        self.demandDraftPayee = ko.observable();
        self.disableConfirmButton = ko.observable(false);
        self.demandDraftDelivery = ko.observable();
        self.confirmScreenDetails = self.params.confirmScreenDetails;
        self.initials = ko.observable(self.payeeData ? oj.IntlConverterUtils.getInitials(self.payeeData().nickName) : null);
        self.preview = ko.observable();
        self.confirmScreenExtensions = self.params.confirmScreenExtensions;

        if (self.params.reviewMode) {
            rootParams.dashboard.headerName(self.params.header);
        }

        self.addressDetails = {
            modeofDelivery: null,
            addressType: null,
            addressTypeDescription: null
        };

        if (self.params.instructionId) {
            self.paymentId = self.params.instructionId;
            self.transferNow(false);
        } else if (self.params.paymentId) {
            self.paymentId = self.params.paymentId;
        } else if (self.params.data) {
            self.paymentId = self.params.data.paymentId || self.params.data.instructionId;
            self.transferNow(!self.params.data.instructionId);
        }

        function loadImage(data) {
            if (data && data.contentDTOList) {
                self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
            }
        }

        let confirmScreenDetailsArray;

        function populateConfirmScreenDetails(data, addresses) {
            confirmScreenDetailsArray = [
                [{
                        label: self.payments.demanddraft.infavourof,
                        value: data.draftDetails.instructionDetails ? data.draftDetails.instructionDetails.inFavourOf : data.inFavourOf
                    },
                    {
                        label: self.payments.demanddraft.amount,
                        value: self.demandDraftPayment().amount.amount,
                        currency: self.demandDraftPayment().amount.currency,
                        isCurrency: true
                    }
                ],
                [{
                        label: self.payments.demanddraft.scheduledon,
                        value: data.draftDetails.instructionDetails ? data.draftDetails.instructionDetails.startDate : data.draftDetails.valueDate,
                        isDate: true
                    },
                    {
                        label: self.payments.demanddraft.transferfrom,
                        value: self.demandDraftPayment().debitAccountId.displayValue
                    }
                ],
                [{
                    label: self.payments.common.DeliveryLocation,
                    value: self.mode() === "OTHADD" ? [addresses.line1, addresses.line2, addresses.state, addresses.city, addresses.country, addresses.postalCode] : [
                        addresses.branchName,
                        addresses.city,
                        addresses.country,
                        addresses.line1,
                        addresses.line2
                    ]
                }]
            ];

            if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: self.params.taskCode,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
        }

        self.imageUploadFlag = ko.observable();

        function getPayeeMaintenance(maintenanceResponse) {
            let propertyValue;

            if (rootParams.dashboard.appData.segment === "CORP") {
                propertyValue = ko.utils.arrayFirst(maintenanceResponse.configurationDetails, function(element) {
                    return element.propertyId === "CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;
            } else {
                propertyValue = ko.utils.arrayFirst(maintenanceResponse.configurationDetails, function(element) {
                    return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;
            }

            if (propertyValue === "Y") {
                self.imageUploadFlag(true);
            } else {
                self.imageUploadFlag(false);
            }

            if (self.imageUploadFlag()) {
                const groupId = self.paymentType().draftDetails.instructionDetails ? self.paymentType().draftDetails.payeeDetails.groupId : self.paymentType().payeeDetails.groupId,
                    payeeId = self.paymentType().draftDetails.instructionDetails ? self.paymentType().draftDetails.payeeDetails.id : self.paymentType().payeeDetails.id;

                draftModel.getPayeeDetails(groupId, payeeId).then(function(payeeData) {
                    self.initials(oj.IntlConverterUtils.getInitials(payeeData.demandDraftPayeeDTO.nickName));

                    if (payeeData.demandDraftPayeeDTO.contentId && payeeData.demandDraftPayeeDTO.contentId.value) {
                        draftModel.retrieveImage(payeeData.demandDraftPayeeDTO.contentId.value).then(function(response) {
                            loadImage(response);
                        });
                    } else {
                        draftModel.getGroupDetails(groupId).then(function(groupData) {
                            if (groupData.payeeGroup.contentId && groupData.payeeGroup.contentId.value) {
                                draftModel.retrieveImage(groupData.payeeGroup.contentId.value).then(function(response) {
                                    loadImage(response);
                                });
                            }
                        });
                    }
                });
            }
        }

        draftModel.getDraftData(self.paymentId, "drafts", "international", self.transferNow()).then(function(data) {
            self.paymentType(data);

            draftModel.getPayeeMaintenance().then(function(maintenanceResponse) {
                getPayeeMaintenance(maintenanceResponse);
            });

            if (self.transferNow()) {
                data.draftDetails.inFavourOf = data.inFavourOf;
                data.draftDetails.startDate = data.draftDetails.valueDate;
                self.demandDraftPayment(data.draftDetails);
                self.demandDraftPayee(data.payeeDetails);
                self.mode(data.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                self.demandDraftDelivery(data.payeeDetails.demandDraftDeliveryDTO);
            } else {
                self.demandDraftPayment(data.draftDetails.instructionDetails);
                self.demandDraftPayee(data.draftDetails.payeeDetails);
                self.mode(data.draftDetails.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                self.demandDraftDelivery(data.draftDetails.payeeDetails.demandDraftDeliveryDTO);
            }

            if (self.mode() === "BRN") {
                self.getBranchAddress(data);
            } else if (self.mode() === "OTHADD") {
                if (self.params) {
                    self.addressDetails.postalAddress = self.params.addressDetails.postalAddress;
                } else if (data.payeeDetails) {
                    self.addressDetails.postalAddress = data.payeeDetails.address;
                } else if (data.draftDetails.payeeDetails) {
                    self.addressDetails.postalAddress = data.draftDetails.payeeDetails.address;
                }

                populateConfirmScreenDetails(data, self.addressDetails.postalAddress);
                self.stageTwo(true);
            } else {
                self.getMyAddress(data);
            }

        });

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON && jqXHR.responseJSON.transactionAction) {
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
            } else if (rootParams.dashboard.appData.segment === "CORP" && jqXHR.status && jqXHR.getResponseStatus() === 202) {
                return self.payments.common.confirmScreen.corpMaker;
            }

            return self.payments.common.confirmScreen.successSI;

        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON && jqXHR.responseJSON.transactionAction) {
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
            } else if (rootParams.dashboard.appData.segment === "CORP" && jqXHR.status && jqXHR.getResponseStatus() === 202) {
                return self.payments.demanddraft.pendingApproval;
            }

            return self.payments.common.success;

        };

        function callbackFunction(data) {
            self.stageTwo(false);

            rootParams.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                favorite: rootParams.dashboard.appData.segment === "CORP",
                hostReferenceNumber: data.externalReferenceId,
                transactionName: self.params.header,
                confirmScreenExtensions: {
                    successMessage: self.getConfirmScreenStatus(data),
                    statusMessages: self.getConfirmScreenStatus(data),
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: self.params.currentTask,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/payments-template"
                }
            }, self);
        }

        self.confirmDDIssue = function() {

            self.disableConfirmButton(true);

            if (self.params.demandDraftPayload.valueDate === null) {
                draftModel.confirmInternationalDDIssue(self.paymentId).then(callbackFunction);
            } else {
                draftModel.confirmInternationalDDInstructionIssue(self.paymentId).then(callbackFunction);
            }
        };

        self.getBranchAddress = function(draftDetails) {
            draftModel.getBranchAddress(self.demandDraftPayee().demandDraftDeliveryDTO.branch).then(function(data) {
                self.addressDetails.postalAddress = data.addressDTO[0] ? data.addressDTO[0].branchAddress.postalAddress : "";
                self.addressDetails.postalAddress.branchName = data.addressDTO[0] ? data.addressDTO[0].branchName : "";
                populateConfirmScreenDetails(draftDetails, self.addressDetails.postalAddress);
                self.stageTwo(true);
            });
        };

        self.getMyAddress = function(draftDetails) {
            draftModel.fetchCourierAddress().then(function(data) {
                if (data.party) {
                    for (let i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === self.demandDraftPayee().demandDraftDeliveryDTO.addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            break;
                        }
                    }
                }

                populateConfirmScreenDetails(draftDetails, self.addressDetails.postalAddress);
                self.stageTwo(true);
            });
        };
    };
});
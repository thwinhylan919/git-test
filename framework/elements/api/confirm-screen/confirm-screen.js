define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/confirm-screen",
    "framework/js/constants/constants",
    "ojs/ojbutton"
], function(ko, $, ConfirmScreenModel, ResourceBundle, Constants) {
    "use strict";

    return function(rootParams) {
        const self = this;

        Object.assign(self, { params: rootParams.rootModel.params });
        self.confirmScreenResources = ResourceBundle;
        self.headerMessages = ko.observableArray();
        rootParams.baseModel.registerComponent("feedback-capture", "feedback");
        self.image = self.params.imageType || "confirm";
        self.enableEReceipt = ko.observable(false);
        self.reason = ko.observable();
        self.renderFeedbackModule = ko.observable(false);
        self.showModal = ko.observable(false);
        self.feedbackTemplateDTO = ko.observable();
        rootParams.baseModel.registerElement("action-header");

        self.transactionID = self.params.transactionResponse ? self.params.transactionResponse.referenceNumber || self.params.transactionResponse.status.referenceNumber :
            self.params.jqXHR.responseJSON.referenceNumber || self.params.jqXHR.responseJSON.status.referenceNumber;

        self.hostReferenceNumber = self.params.hostReferenceNumber;
        self.httpStatus = self.params.transactionResponse ? self.params.transactionResponse.getResponseStatus() : self.params.jqXHR.status;
        self.serviceNo = self.params.serviceNo ? self.params.serviceNo : null;
        self.srNo = self.params.srNo ? self.params.srNo : null;
        self.isStatusWordRequired = Constants.userSegment !== "RETAIL";
        self.transactionName = self.params.transactionName._latestValue || self.params.transactionName;
        self.buttonTemplate = self.params.template;
        self.confirmScreenExtensions = self.params.confirmScreenExtensions && self.params.confirmScreenExtensions.isSet ? self.params.confirmScreenExtensions : null;
        self.enableEReceipt(self.params.transactionResponse ? self.params.transactionResponse.status.receiptAvailable : self.params.jqXHR.responseJSON.status.receiptAvailable);

        self.eReceiptDetails = {
            enableEReceipt: self.enableEReceipt(),
            header: self.confirmScreenResources.confirm.eReceipt,
            altText: self.confirmScreenResources.confirm.downloadEreceipt,
            title: self.confirmScreenResources.confirm.downloadEreceiptAlt
        };

        if (self.confirmScreenExtensions && self.confirmScreenExtensions.taskCode) {
            if (self.params.transactionResponse ? !self.params.transactionResponse.transactionAction : !self.params.jqXHR.responseJSON.transactionAction) {
                ConfirmScreenModel.fetchFeedbackTemplates(self.confirmScreenExtensions.taskCode).then(function(data) {
                    if (data.feedbackEnabled && (data.feedbackTemplateDTO.length > 0) && data.feedbackTemplateDTO[0].definitionDTOs[0].transactionId) {
                        if (data.feedbackforTransaction === "ONCE") {
                            if (!data.feedbackCaptured) {
                                self.feedbackTemplateDTO(data);
                            }
                        } else {
                            self.feedbackTemplateDTO(data);
                        }
                    }
                });
            }
        }

        self.confirmationModalData = {
            componentName: null,
            data: null,
            header: null,
            openHandler : function() {
                $("#confirm-modal").trigger("openModal");
            },
            closeHandler : function(){
                self.showModal(false);
            }
        };

        const txnName = self.transactionName || self.confirmScreenResources.confirm.DEFAULT_TXN_NAME;

        rootParams.dashboard.headerName(txnName);

        const evaluateStatus = function(jqXHR) {
            const JSONResponse = jqXHR.responseJSON || jqXHR;

            if (JSONResponse.transactionAction && JSONResponse.transactionAction.transactionDTO) {
                const response = JSONResponse.transactionAction.transactionDTO;

                if (response.processingDetails && response.processingDetails.status === "S") {
                    return "FINAL_LEVEL_APPROVED";
                } else if (response.processingDetails && response.processingDetails.status === "P") {
                    return "MID_LEVEL_APPROVED";
                } else if (response.processingDetails.status === "F" && response.processingDetails.currentStep === "exec") {
                    return "REJECT_BY_HOST";
                } else if (response.processingDetails && response.processingDetails.status === "F") {
                    return "REJECT";
                }
            } else if (jqXHR.status === 202 || (jqXHR.getResponseStatus && jqXHR.getResponseStatus() === 202)) {
                return "INITIATED";
            } else if (jqXHR.status === 200 || jqXHR.status === 201 || (jqXHR.getResponseStatus && jqXHR.getResponseStatus() === 200) || (jqXHR.getResponseStatus && jqXHR.getResponseStatus() === 201)) {
                return "AUTO_AUTH";
            } else {
                return "REJECT_BY_HOST";
            }
        };

        self.getStatusMessage = function(jqXHR) {
            const status = evaluateStatus(jqXHR);

            if (self.confirmScreenExtensions && self.confirmScreenExtensions.confirmScreenStatusEval) {
                return self.confirmScreenExtensions.confirmScreenStatusEval(jqXHR, status);
            }

            if ((status === "REJECT_BY_HOST" && jqXHR.responseJSON && jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO) ||
                (status === "REJECT_BY_HOST" && jqXHR.transactionAction && jqXHR.transactionAction.transactionDTO)) {
                self.reason($("<div/>").html((jqXHR.responseJSON && jqXHR.responseJSON.transactionAction.transactionDTO.errors[0].errorMessage) || jqXHR.transactionAction.transactionDTO.errors[0].errorMessage).text());
            }

            return self.confirmScreenResources.confirm.status[status];
        };

        self.successMessage = function(jqXHR) {
            const status = evaluateStatus(jqXHR);

            if (self.confirmScreenExtensions && self.confirmScreenExtensions.confirmScreenMsgEval) {
                return self.confirmScreenExtensions.confirmScreenMsgEval(jqXHR, txnName, status, self.transactionID, self.hostReferenceNumber);
            } else if (self.confirmScreenResources.confirm.staticMessages[Constants.userSegment]) {
                return self.confirmScreenResources.confirm.staticMessages[Constants.userSegment][status];
            }

            const message = status === "AUTO_AUTH" || status === "FINAL_LEVEL_APPROVED" ? self.confirmScreenResources.confirm[Constants.userSegment + "_SUCCESS_MESSAGE"] : null;

            return rootParams.baseModel.format(message || self.confirmScreenResources.confirm.defaultSuccessMessage, {
                txnName: txnName,
                status: self.confirmScreenResources.confirm.status[status],
                transactionID: self.transactionID,
                hostReferenceNumber: self.hostReferenceNumber
            });
        };

        (function(jqXHRs) {
            if (!Array.isArray(jqXHRs)) {
                jqXHRs = [jqXHRs];
            }

            jqXHRs.forEach(function(jqXHR) {
                const currentStatus = evaluateStatus(jqXHR),
                    isRejected = currentStatus === "REJECT_BY_HOST";

                self.headerMessages.push({
                    icon: isRejected ? "dashboard/cancellation.svg" : "dashboard/confirmation.svg",
                    headerMessage: isRejected ? self.confirmScreenResources.confirm.errorText : self.confirmScreenResources.confirm.confirmText,
                    summaryMessage: self.successMessage(jqXHR),
                    headerStyle: isRejected ? "errorHeader" : "successHeader",
                    eReceiptDetails: self.eReceiptDetails
                });
            });
        })(self.params.transactionResponse ? self.params.transactionResponse.batchDetailResponseDTOList || self.params.transactionResponse :
            self.params.jqXHR.responseJSON.batchDetailResponseDTOList || self.params.jqXHR);

        self.openTransaction = function(compname, applicationType, moduleURL) {
            rootParams.baseModel.registerComponent(compname, applicationType);

            if (Constants.userSegment === "RETAIL") {
                self.selectedTab = null;

                rootParams.dashboard.loadComponent("manage-accounts", {
                    defaultTab: compname,
                    applicationType: applicationType,
                    moduleURL: moduleURL,
                    isSuccess: true
                });
            } else {
                rootParams.dashboard.loadComponent(compname);
            }
        };

        self.share = function() {
            window.plugins.sharing.shareWithOptions({
                message: self.params.shareMessage
            });
        };

        self.openModalWindow = function(componentName,params,header){

            Object.assign(self.confirmationModalData,{
                componentName: componentName,
                data: params,
                header: header
            });

            self.showModal(true);
        };

        self.handleOk = function() {
            if (self.params.handleOk) {
                self.params.handleOk();
            } else if (self.homeComponent) {
                rootParams.dashboard.loadComponent(self.homeComponent, {});
            } else {
                rootParams.dashboard.switchModule();
            }
        };

        self.downloadEreceipt = function() {
            ConfirmScreenModel.downloadEreceipt(self.transactionID);
        };

        self.showFeedbackOverlay = function() {
            self.renderFeedbackModule(true);
        };
    };
});
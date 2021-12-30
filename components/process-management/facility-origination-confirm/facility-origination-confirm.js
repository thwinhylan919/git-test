define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/facility-origination-confirm",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton"
], function(ko, ApplicationListingModel, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.state = ko.observable();
        self.a = ko.observable();
        self.confirmScreenDetailsArray = ko.observableArray();
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("apply-new-facility-landing", "process-management");
        params.baseModel.registerComponent("application-tracker-film-strip", "process-management");

        self.proceedAppTracker = function() {
            params.dashboard.loadComponent("application-tracker-film-strip");

        };

        self.proceedNewApplication = function() {
            params.dashboard.loadComponent("apply-new-facility-landing");

        };

        self.getConfirmScreenTransactionMessage = function(jqXHR) {
            if (jqXHR.getResponseStatus() === 202) {
                return self.nls.loanConfirmation.confirmScreen.approvalMessages.Initiated.successmsg;
            } else if (jqXHR.getResponseStatus() === 200) {
                return self.nls.loanConfirmation.confirmScreen.approvalMessages.Completed.successmsg;
            } else if (jqXHR.getResponseStatus() === 201 && !(jqXHR.processManagementDTO && jqXHR.processManagementDTO.status === "DRAFT")) {
                return self.nls.loanConfirmation.confirmScreen.approvalMessages.Completed.successmsg;
            } else if (jqXHR.getResponseStatus() === 201 && jqXHR.processManagementDTO && jqXHR.processManagementDTO.status === "DRAFT") {
                return self.nls.loanConfirmation.draftSuccessMessage;
            }
        };

        self.getConfirmScreenTransactionStatus = function(jqXHR) {
            if (jqXHR.getResponseStatus() === 202) {
                return self.nls.loanConfirmation.confirmScreen.approvalMessages.Initiated.statusmsg;
            } else if (jqXHR.getResponseStatus() === 200) {
                return self.nls.loanConfirmation.confirmScreen.approvalMessages.Completed.statusmsg;
            } else if (jqXHR.getResponseStatus() === 201) {
                return self.nls.loanConfirmation.confirmScreen.approvalMessages.Completed.statusmsg;
            }
        };

        if (params.rootModel.params.mode && params.rootModel.params.mode === "draft") {
            self.confirmScreenDetailsArray.push([{
                label: self.nls.loanConfirmation.draftRefNumber,
                value: params.rootModel.params.data.processManagementDTO.refId
            }]);

            params.dashboard.loadComponent("confirm-screen", {
                transactionResponse: params.rootModel.params.data,
                transactionName: self.nls.loanConfirmation.facilityApplication,
                confirmScreenExtensions: {
                    type: "Facility",
                    isSet: true,
                    taskCode: "GR_M_CF_CF",
                    confirmScreenDetails: self.confirmScreenDetailsArray(),
                    confirmScreenMsgEval: self.getConfirmScreenTransactionMessage,
                    confirmScreenStatusEval: self.getConfirmScreenTransactionStatus,
                    template: "confirm-screen/credit-facility"
                }
            }, self);
        } else if (params.rootModel.params.data.status !== undefined) {
            self.applicationNumber = params.rootModel.params.data.facilityDTO ? params.rootModel.params.data.facilityDTO.externalReferenceId : params.rootModel.params.data.status.externalReferenceNumber;

            const jqXhr = params.rootModel.params.jqXhr,
                hostReferenceNumber = params.rootModel.params.data.facilityDTO ? params.rootModel.params.data.facilityDTO.externalReferenceId : params.rootModel.params.data.status.externalReferenceNumber;

            if ((params.rootModel.params.data.facilityDTO && params.rootModel.params.data.facilityDTO.externalReferenceId) || params.rootModel.params.data.status.externalReferenceNumber) {
                self.confirmScreenDetailsArray.push([{
                    label: self.nls.loanConfirmation.facilityApplicationNo,
                    value: params.rootModel.params.data.facilityDTO ? params.rootModel.params.data.facilityDTO.externalReferenceId : params.rootModel.params.data.status.externalReferenceNumber
                }]);
            }

            if (self.productData && self.productData() && self.productData().data.id) {
                ApplicationListingModel.deleteDraft(self.productData().data.id).then(function(data) {
                    self.a(data);
                });
            }

            params.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXhr,
                hostReferenceNumber: hostReferenceNumber,
                transactionName: self.nls.loanConfirmation.facilityApplication,
                confirmScreenExtensions: {
                    isSet: true,
                    taskCode: "GR_M_CF_CF",
                    type: "Facility",
                    confirmScreenDetails: self.confirmScreenDetailsArray(),
                    template: "confirm-screen/credit-facility"
                }
            }, self);
        } else {

            params.dashboard.loadComponent("confirm-screen", {
                jqXHR: params.rootModel.params.jqXhr,
                transactionName: self.nls.loanConfirmation.facilityApplication,
                confirmScreenExtensions: {
                    isSet: true,
                    taskCode: "GR_M_CF_CF",
                    type: "Facility",
                    confirmScreenDetails: self.confirmScreenDetailsArray(),
                    template: "confirm-screen/credit-facility"
                }
            }, self);

        }
    };
});
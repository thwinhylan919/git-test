define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function processManagementrefIddeleteCall(refId, payload, config) {
            return Model.processManagementrefIddelete(refId, payload, config);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.state = ko.observable();
            self.confirmScreenDetailsArray = ko.observableArray([]);
            params.baseModel.registerElement("confirm-screen");
            params.baseModel.registerComponent("collateral-evaluation-landing", "credit-facility");
            params.baseModel.registerComponent("application-tracker-film-strip", "process-management");

            self.getConfirmScreenTransactionMessage = function (jqXHR) {
                if (jqXHR.getResponseStatus() === 202) {
                    return self.nls.confirmScreen.approvalMessages.Initiated.successmsg;
                } else if (jqXHR.getResponseStatus() === 200) {
                    return self.nls.confirmScreen.approvalMessages.Completed.successmsg;
                } else if (jqXHR.getResponseStatus() === 201 && !(jqXHR.processManagementDTO && jqXHR.processManagementDTO.status === "DRAFT")) {
                    return self.nls.confirmScreen.approvalMessages.Completed.successmsg;
                } else if (jqXHR.getResponseStatus() === 201 && jqXHR.processManagementDTO && jqXHR.processManagementDTO.status === "DRAFT") {
                    return self.nls.draftSuccessMessage;
                }
            };

            self.getConfirmScreenTransactionStatus = function (jqXHR) {
                if (jqXHR.getResponseStatus() === 202) {
                    return self.nls.confirmScreen.approvalMessages.Initiated.statusmsg;
                } else if (jqXHR.getResponseStatus() === 200) {
                    return self.nls.confirmScreen.approvalMessages.Completed.statusmsg;
                } else if (jqXHR.getResponseStatus() === 201) {
                    return self.nls.confirmScreen.approvalMessages.Completed.statusmsg;
                }
            };

            if (params.rootModel.params.mode && params.rootModel.params.mode === "draft") {
                params.rootModel.params.data.referenceNumber = params.rootModel.params.data.processManagementDTO.refId;

                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: params.rootModel.params.data,
                    transactionName: self.nls.draftConfirmation,
                    confirmScreenExtensions: {
                        isSet: true,
                        type: "Evaluation",
                        taskCode: "CF_N_ECA",
                        confirmScreenDetails: self.confirmScreenDetailsArray(),
                        confirmScreenMsgEval: self.getConfirmScreenTransactionMessage,
                        confirmScreenStatusEval: self.getConfirmScreenTransactionStatus,
                        template: "confirm-screen/credit-facility"
                    }
                });
            } else if (params.rootModel.params.data.jsonNode !== undefined) {
                self.applicationNumber = params.rootModel.params.data.jsonNode.data.appRefNo;

                const jqXhr = params.rootModel.params.jqXhr, hostReferenceNumber = params.rootModel.params.data.jsonNode.data.appRefNo;

                if (params.rootModel.params.data.jsonNode.data.facilityId) {
                    self.confirmScreenDetailsArray.push([{
                            label: self.nls.collateralEvaluation,
                            value: params.rootModel.params.data.jsonNode.data.facilityId
                        }]);
                }

                if (self.productData().data.id) {
                    processManagementrefIddeleteCall(self.productData().data.id).then(function (data) {
                        self.a = ko.observable(data);
                    });
                }

                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    hostReferenceNumber: hostReferenceNumber,
                    transactionName: self.nls.collateralEvaluation,
                    confirmScreenExtensions: {
                        isSet: true,
                        type: "Evaluation",
                        taskCode: "CF_N_ECA",
                        confirmScreenDetails: self.confirmScreenDetailsArray(),
                        template: "confirm-screen/credit-facility"
                    }
                });
            } else {
                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: params.rootModel.params.data,
                    hostReferenceNumber: params.rootModel.params.data && params.rootModel.params.data.collateralDTO && params.rootModel.params.data.collateralDTO.externalReferenceId,
                    transactionName: self.nls.collateralEvaluation,
                    confirmScreenExtensions: {
                        isSet: true,
                        type: "Evaluation",
                        taskCode: "CF_N_ECA",
                        confirmScreenDetails: self.confirmScreenDetailsArray(),
                        template: "confirm-screen/credit-facility",
                        confirmScreenMsgEval: self.getConfirmScreenTransactionMessage,
                        confirmScreenStatusEval: self.getConfirmScreenTransactionStatus
                    }
                });
            }

            return true;
        }

        return {
            processManagementrefIddeleteCall: processManagementrefIddeleteCall,
            init: init
        };
    };
});
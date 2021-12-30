define([
    "knockout",
    "jquery"
], function (ko, $) {
    "use strict";

    return function () {
        let self,
         params;

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.confirmScreenDetailsArray = ko.observableArray([]);

            self.productData = {
                productId: "collateralEvaluation",
                dataSegments: [
                    { id: "collateral-evaluation-details" },
                    { id: "collateral-evaluation-ownership-details" },
                    { id: "collateral-evaluation-seniority-details" },
                    { id: "collateral-evaluation-documents-upload" }
                ],
                data: {
                    module: "OBCFPM",
                    type: "Collateral Evaluation",
                    mode: "approval"
                },
                payload: params.rootModel.params.data
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

            if (rootParams.rootModel.params && rootParams.rootModel.params.data && rootParams.rootModel.params.data.jsonNode && rootParams.rootModel.params.data.jsonNode.data.facilityId) {
                self.confirmScreenDetailsArray.push([{
                        label: self.nls.collateralEvaluation,
                        value: params.rootModel.params.data.jsonNode.data.facilityId
                    }]);
            }

            if (rootParams.rootModel.params && rootParams.rootModel.params.confirmScreenExtensions) {
                $.extend(rootParams.rootModel.params.confirmScreenExtensions, {
                    isSet: true,
                    type: "Evaluation",
                    taskCode: "CF_N_ECA",
                    confirmScreenDetails: self.confirmScreenDetailsArray(),
                    template: "confirm-screen/credit-facility",
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus
                });
            }

            params.baseModel.registerComponent("collateral-evaluation-details", "credit-facility");
            params.baseModel.registerComponent("collateral-evaluation-ownership-details", "credit-facility");
            params.baseModel.registerComponent("collateral-evaluation-seniority-details", "credit-facility");
            params.baseModel.registerComponent("collateral-evaluation-documents-upload", "credit-facility");
            params.baseModel.registerElement("segment-review");

            return true;
        }

        return { init: init };
    };
});
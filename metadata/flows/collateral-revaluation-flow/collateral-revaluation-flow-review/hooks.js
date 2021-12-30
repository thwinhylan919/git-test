define([
    "./model",
    "jquery",
    "knockout"
], function (Model, $, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function liabilitiesgetCall(partyId, payload, config) {
            return Model.liabilitiesget(partyId, payload, config);
        }

                function liabilitiesliabilityIdcollateralsIdgetCall(Id, liabilityId, payload, config) {
            return Model.liabilitiesliabilityIdcollateralsIdget(Id, liabilityId, payload, config);
        }

                function collateralApplicationsIdputCall(Id, payload, config) {
            return Model.collateralApplicationsIdput(Id, payload, config);
        }

                function onClickOk75() {
            self.closeHandler();
        }

                function onClickTermsandconditions9() {
            $("#termsConditions").trigger("openModal");
        }

        function init(bindingContext, _rootParams) {
            self = bindingContext;
            params = _rootParams;
            self.collateralId = ko.observable(self.payload.collateralCode);
            self.collateralAmount = ko.observable();
            self.collateralAmountCurrency = ko.observable();
            self.utilizedAmount = ko.observable();
            self.utilizedAmountCurrency = ko.observable();
            self.availableAmount = ko.observable();
            self.availableAmountCurrency = ko.observable();
            self.revisionDate = ko.observable();
            self.collateralDescription = ko.observable();
            self.review = true;
            params.baseModel.registerComponent("collateral-revaluation-details", "credit-facility");
            params.baseModel.registerComponent("application-tracker-film-strip", "process-management");
            params.baseModel.registerComponent("collateral-details", "credit-facility");
            self.isTermSelected = ko.observableArray();
            self.document = self.payload.document;

            self.pageRendered = function () {
                return true;
            };

            self.closeHandler = function () {
                $("#termsConditions").hide();
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
                } else if (jqXHR.getResponseStatus() === 200) {
                    return self.nls.confirmScreen.approvalMessages.Completed.successmsg;
                }
            };

            self.getConfirmScreenTransactionStatus = function (jqXHR) {
                if (jqXHR.getResponseStatus() === 202) {
                    return self.nls.confirmScreen.approvalMessages.Initiated.statusmsg;
                } else if (jqXHR.getResponseStatus() === 200) {
                    return self.nls.confirmScreen.approvalMessages.Completed.statusmsg;
                }
            };

            if (self.getStageState("collateral-revaluation-flow-review").rawApprovalData && self.getStageState("collateral-revaluation-flow-review").rawApprovalData.confirmScreenExtensions) {
                $.extend(self.getStageState("collateral-revaluation-flow-review").rawApprovalData.confirmScreenExtensions, {
                    isSet: true,
                    template: "confirm-screen/credit-facility",
                    type: "Revaluation",
                    fromApproval: true,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus
                });
            }

            liabilitiesgetCall().then(function (response) {
                liabilitiesliabilityIdcollateralsIdgetCall(self.payload.collateralCode, response.liabilitydtos[0].id).then(function (data) {
                    self.availableAmount(data.collateralDTO.availableAmount.amount);
                    self.availableAmountCurrency(data.collateralDTO.availableAmount.currency);
                    self.collateralDescription(data.collateralDTO.collateralDesc);
                    self.utilizedAmount(data.collateralDTO.utilizationAmount.amount);
                    self.utilizedAmountCurrency(data.collateralDTO.utilizationAmount.currency);
                    self.collateralAmount(data.collateralDTO.collateralValue.amount);
                    self.collateralAmountCurrency(data.collateralDTO.collateralValue.currency);
                    self.revisionDate(data.collateralDTO.revisionDate);
                });
            });

            return true;
        }

        return {
            liabilitiesgetCall: liabilitiesgetCall,
            liabilitiesliabilityIdcollateralsIdgetCall: liabilitiesliabilityIdcollateralsIdgetCall,
            collateralApplicationsIdputCall: collateralApplicationsIdputCall,
            onClickOk75: onClickOk75,
            onClickTermsandconditions9: onClickTermsandconditions9,
            init: init
        };
    };
});
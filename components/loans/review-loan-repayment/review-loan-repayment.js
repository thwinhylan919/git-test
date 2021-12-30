define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/review-loan-repayment",
  "./model"
], function(ko, $, ResourceBundle, LoansRepayModel) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(ResourceBundle.header);
    self.modelData = self.params.data;
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resource.common.review;
    self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;
    rootParams.baseModel.registerComponent("loan-details", "loans");

    self.showAccountDetails = function() {
      const data = {
        id: {
          value: self.modelData.loanAccountId.value
        }
      };

      rootParams.dashboard.loadComponent("loan-details", data);
    };

    self.getConfirmScreenMsgForApproval = function(jqXHR) {
      if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
        return self.resource.confirmationMsg.approvalMessages.FAILED.successmsg;
      } else if (jqXHR.responseJSON.transactionAction) {
        return self.resource.confirmationMsg.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
      }
    };

    self.getConfirmScreenStatusForApproval = function(jqXHR) {
      if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
        return self.resource.confirmationMsg.approvalMessages.FAILED.statusmsg;
      } else if (jqXHR.responseJSON.transactionAction) {
        return self.resource.confirmationMsg.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
      }
    };

    if (self.params.confirmScreenExtensions) {
      $.extend(self.params.confirmScreenExtensions, {
        isSet: true,
        template: "confirm-screen/loan-repayment",
        loanAccountId : self.modelData.loanAccountId.value,
        transactionName: self.resource.header,
        confirmScreenMsgEval: self.getConfirmScreenMsgForApproval,
        confirmScreenStatusEval: self.getConfirmScreenStatusForApproval
      });
    }

    self.submitRepaymentRequest = function() {
      LoansRepayModel.createRepaymentRequest(self.modelData.loanAccountId.value, ko.mapping.toJSON(self.modelData, {
        ignore: ["loanAccountId"]
      })).done(function(transactionResponse, status, jqXHR) {
        let message;

        self.confirmScreenExtensions = self.params;

        if (jqXHR.status === 202) {
          message = self.resource.confirmationMsg.INITIATED;
        } else if (jqXHR.status === 201) {
          message = self.resource.confirmationMsg.AUTO_AUTH;
        } else {
          message = self.resource.confirmationMsg.FINAL_LEVEL_APPROVED;
        }

        self.confirmScreenExtensions.template = "confirm-screen/loan-repayment";
        self.confirmScreenExtensions.isSet = true;
        self.confirmScreenExtensions.loanAccountId = self.modelData.loanAccountId.value;

        self.confirmScreenExtensions.confirmScreenMsgEval = function() {
          return message;
        };

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionResponse: transactionResponse,
          transactionName: self.resource.header,
          confirmScreenExtensions: self.confirmScreenExtensions,
          hostReferenceNumber: transactionResponse.repaymentDetail.key,
          resource: self.resource
        }, self);

      });
    };
  };
});

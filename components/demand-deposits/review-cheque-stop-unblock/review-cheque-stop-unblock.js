define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/review-cheque-stop-unblock"
], function(ko, StopUnblockChequeReviewModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.dashboard.headerName(ResourceBundle.header);
    self.resource = ResourceBundle;
    self.reviewTransactionName = [];
    self.accountNumber = rootParams.rootModel.params.accountNumber;
    self.reviewTransactionName.header = self.resource.common.review;
    self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;

    self.submit = function() {
      StopUnblockChequeReviewModel.postRequest(self.accountNumber(), ko.mapping.toJSON(rootParams.rootModel.params.data)).then(function(data, status) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionName: self.resource.header,
          eReceiptRequired: true,
          transactionResponse: data,
          hostReferenceNumber: data.revokeStopChequeInstructionDTO.chequeInstructionRefNo,
          confirmScreenExtensions: rootParams.rootModel.params.confirmScreenExtensions,
          template: "confirm-screen/casa-template"
        }, self);
      });
    };

    (function(extensionObject) {
      extensionObject.isSet = true;
      extensionObject.data = self.params.data;
      extensionObject.template = "confirm-screen/cheque-stop-unblock";
      extensionObject.resourceBundle = ResourceBundle;
      extensionObject.successMessage = "";
      extensionObject.statusMessages = "";
      extensionObject.taskCode = "CH_N_CIN";

      extensionObject.confirmScreenMsgEval = function(_jqXHR, txnName, status, referenceNo, hostReferenceNo) {
        return rootParams.baseModel.format(ResourceBundle.confirmationMsg[status], {
          txnName: txnName,
          referenceNo: referenceNo,
          hostReferenceNo: hostReferenceNo
        });
      };
    })(self.params.confirmScreenExtensions);
  };
});

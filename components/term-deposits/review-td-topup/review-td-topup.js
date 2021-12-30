define([
    "knockout",
    "ojL10n!resources/nls/review-td-topup"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.dashboard.headerName(ResourceBundle.transactions.topUp.topUp);
    self.resource = ResourceBundle;
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resource.common.review;
    self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;

    const populateConfirmScreenExtensions = function(extension) {
      extension.isSet = true;
      extension.data = self.params.data;
      extension.template = "confirm-screen/td-topup";
      extension.resourceBundle = ResourceBundle;
      extension.successMessage = "";
      extension.statusMessages = "";
      extension.taskCode = "TD_F_TTD";

      extension.confirmScreenMsgEval = function(_jqXHR, txnName, status, referenceNo, hostReferenceNo) {
        return rootParams.baseModel.format(ResourceBundle.confirmationMsg[status], {
          txnName: txnName,
          referenceNo: referenceNo,
          hostReferenceNo: hostReferenceNo
        });
      };
    };

    populateConfirmScreenExtensions(self.params.confirmScreenExtensions);
  };
});

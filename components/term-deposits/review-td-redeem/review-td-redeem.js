define([
    "knockout",
    "ojL10n!resources/nls/review-td-redeem"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.common.termDpositHeader);
    rootParams.baseModel.registerElement("internal-account-input");
    self.resource = ResourceBundle;
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resource.common.review;
    self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;

    const populateConfirmScreenExtensions = function(extension) {
      extension.isSet = true;
      extension.data = self.params.data;
      extension.holdAmount = self.params.holdAmount;
      extension.template = "confirm-screen/td-redeem";
      extension.resourceBundle = ResourceBundle;
      extension.successMessage = "";
      extension.statusMessages = "";
      extension.taskCode = "TD_F_RTD";

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

define([
  "knockout",

  "ojL10n!resources/nls/review-statement-request"
], function(ko, locale) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = locale;
    params.dashboard.headerName(self.nls.header);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.review;
    self.reviewTransactionName.reviewHeader = self.nls.reviewHeader;

    if (self.params.transactionDetails && self.params.transactionDetails.transactionSnapshot) {
         self.reviewData = ko.mapping.toJS(params.rootModel.params.data);
         self.reviewData.selectedAccount = self.reviewData.accountId.displayValue;
    }
    else{
      self.reviewData = ko.mapping.toJS(params.rootModel.params.data.payLoadData);
    }

    (function(extensionObject) {
      extensionObject.isSet = true;
      extensionObject.data = self.reviewData;
      extensionObject.template = "confirm-screen/statement-request";
      extensionObject.resourceBundle = locale;
      extensionObject.successMessage = "";
      extensionObject.statusMessages = "";
      extensionObject.taskCode = self.params.taskCode || self.taskCode;

      extensionObject.confirmScreenMsgEval = function(_jqXHR, txnName, status, referenceNo, hostReferenceNo) {
        return params.baseModel.format(locale.confirmationMsg[status], {
          txnName: txnName,
          referenceNo: referenceNo,
          hostReferenceNo: hostReferenceNo
        });
      };
    })(self.params.confirmScreenExtensions);
  };
});
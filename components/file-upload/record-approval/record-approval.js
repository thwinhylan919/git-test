define([

  "knockout",

  "ojL10n!resources/nls/record-approval"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.recordApproval;
    rootParams.dashboard.headerName(self.Nls.bulkRecordApproval);
    self.displayComponent = ko.observable();

    const transactionDetail = ko.utils.unwrapObservable(rootParams.rootModel.params.transactionDetails);

    if (transactionDetail.discriminator === "BULK_RECORD") {
      rootParams.baseModel.registerComponent("record-view", "file-upload");
      self.displayComponent("record-view");
    } else if (transactionDetail.discriminator === "NON_FINANCIAL_BULK_RECORD") {
      rootParams.baseModel.registerComponent("record-view-non-financial", "file-upload");
      self.displayComponent("record-view-non-financial");
    } else if (transactionDetail.discriminator === "BULK_RECORD_ADMIN") {
      rootParams.baseModel.registerComponent("record-view-admin", "file-upload");
      self.displayComponent("record-view-admin");
    }

    self.selectedRecord = ko.observable(transactionDetail);
    self.selectedRecord().discriminator = self.Nls.approver;

    if (transactionDetail.approvalDetails.status.toUpperCase() === "PROCESSED")
      {self.selectedRecord().status = "APPROVED";}
    else
      {self.selectedRecord().status = "VERIFIED";}

    rootParams.baseModel.registerComponent("record-view", "file-upload");
  };
});
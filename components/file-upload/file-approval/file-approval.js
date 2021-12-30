define([
    "knockout",
    "./model",
  "ojL10n!resources/nls/file-approval",
  "ojs/ojbutton",
  "ojs/ojinputtext"
], function(ko, fileApprovalModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.fileApproval;
    rootParams.dashboard.headerName(self.Nls.bulkFileApproval);

    const fileData = ko.utils.unwrapObservable(self.params.data);

    self.fileReferenceId = ko.observable(fileData.fileRefId);
    self.fileDetails = ko.observable();
    self.isFileDetailsLoaded = ko.observable(false);
    self.statusList = ko.observableArray();
    self.statusListMap = {};
    self.isStatusListLoaded = ko.observable(false);
    self.fileDetails = ko.observable();
    rootParams.baseModel.registerComponent("file-history", "file-upload");
    rootParams.baseModel.registerComponent("record-listing", "file-upload");

    fileApprovalModel.getFileStatus().done(function(data) {
      self.statusList(data.enumRepresentations[0].data);

      for (let i = 0; i < self.statusList().length; i++) {
        self.statusListMap[self.statusList()[i].code] = self.statusList()[i].description;
      }

      self.isStatusListLoaded(true);

      fileApprovalModel.listFiles(self.fileReferenceId()).done(function(data) {
        if (data.fileDetails) {
          for (let i = 0; i < data.fileDetails.length; i++) {
            const fileData = data.fileDetails[i].fileUpload;

            fileData.fileStatusDesc = self.statusListMap[fileData.fileStatus];
            fileData.fileId = fileData.key.id;
            fileData.description = fileData.fileIdentifier + "-" + fileData.fileIdentifierDescription;
            fileData.paymentType = self.Nls[fileData.transaction];
            self.fileDetails(fileData);
          }

          self.isFileDetailsLoaded(true);
        }
      });
    });
  };
});
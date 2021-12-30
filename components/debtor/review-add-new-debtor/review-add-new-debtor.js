define([
    "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/add-new-debtor",
  "ojs/ojknockout",
  "ojs/ojbutton",
  "ojs/ojavatar"
], function(ko, $, newDebtorModel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.nls = ResourceBundle;
    self.resource = ResourceBundle.debtors;
    self.common = ResourceBundle.common;
    self.debtorDetails = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.preview = ko.observable();
    self.debtorName =self.params.debtorName;
    self.debtor = self.params.debtor;
     self.contentId = self.params.contentId;
    self.confirmAddDebtor = self.params.confirmAddDebtor;
    self.imageUploadFlag = self.params.imageUploadFlag;
    self.bankDetailsCode= self.params.bankDetailsCode;
    self.fileId = ko.observable("input");
    self.target = ko.observable("target");
    Params.dashboard.headerName(self.params.header);
    Params.baseModel.registerComponent("warning-message-dialog", "payee");

    function loadImage() {
      newDebtorModel.retrieveImage(self.contentId()).then(function(data) {
        if (data && data.contentDTOList[0]) {
          self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
          $("#" + self.target()).attr("src", self.preview());
        }
      });
    }

    newDebtorModel.readDebtor(self.params.payerId, self.params.groupId).done(function(data) {
      self.debtorDetails(data);

      if (self.contentId())
        {loadImage();}

      self.dataLoaded(true);
    });
  };
});
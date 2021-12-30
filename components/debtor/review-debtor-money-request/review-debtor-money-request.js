define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/debtor-money-request",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojbutton"
], function(ko, RequestMoneyModel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.customDebtorName = self.params.customDebtorName || ko.observable();
    self.preview = ko.observable();
    self.initials = self.params.initials;
    self.contentId =self.params.contentId;
    self.confirmRequest =self.params.confirmRequest;
    self.RequestMoneyModel =self.params.RequestMoneyModel;
    self.receivedDate =self.params.receivedDate;

    Params.dashboard.headerName(self.params.header);

    RequestMoneyModel.getTransferData(self.params.instructionId()).done(function() {
      self.dataLoaded(true);
    });

    if (self.contentId()) {
      RequestMoneyModel.retrieveImage(self.contentId()).then(function(data) {
        if (data && data.contentDTOList[0]) {
          self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
        }
      });
    }

    const configurationDetails = {};

    self.imageUploadFlag = ko.observable();

    RequestMoneyModel.getPayeeMaintenance().then(function(data) {
      for (let k = 0; k < data.configurationDetails.length; k++) {
        configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
      }

      self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
    });
  };
});
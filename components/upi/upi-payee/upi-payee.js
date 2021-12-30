define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/create-vpa",
  "ojs/ojknockout",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojbutton"
], function (ko, upiPayeeModel, ResourceBundle) {
  "use strict";

  return function (Params) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(upiPayeeModel.getNewModel());

        return KoModel;
      };

    ko.utils.extend(self, Params.rootModel);
    self.validationTracker = Params.validator;
    self.nls = ResourceBundle;
    self.imageUploadFlag = ko.observable();
    self.payeeName = ko.observable();
    self.contentId = ko.observable();
    self.payeeId = ko.observable();
    self.payeeGroupPayload = getNewKoModel().payeeGroup;
    self.payeePayload = getNewKoModel().payee;
    self.vpaId = ko.observable();
    self.nickName = ko.observable();
    self.accountName = ko.observable();
    self.payeeGroupId = ko.observable();
    self.file = ko.observable();
    self.fileId = ko.observable("input");
    self.preview = ko.observable();
    self.imageId = ko.observable("target");
    self.isExisting = ko.observable(false);
    Params.dashboard.headerName(self.nls.upiPayee.header);
    Params.baseModel.registerComponent("review-upi-payee", "upi");
    Params.baseModel.registerComponent("image-upload", "goals");

    if (Params.rootModel.params) {
      if (Params.rootModel.params.isExisting) {
        self.isExisting(Params.rootModel.params.isExisting);
        self.payeeName(Params.rootModel.params.payeeName);
        self.vpaId(Params.rootModel.params.vpaId);
        self.accountName(Params.rootModel.params.accountName);
        self.contentId(Params.rootModel.params.contentId());
        self.payeeGroupId(Params.rootModel.params.payeeGroupId);
      }
      else if (!Params.rootModel.params.isExisting) {
        self.vpaId(Params.rootModel.params.vpaId);
        self.accountName(Params.rootModel.params.accountName);
      }
    }

    upiPayeeModel.getPayeeMaintenance().then(function (data) {
      const configurationDetails = {};

      for (let k = 0; k < data.configurationDetails.length; k++) {
        configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
      }

      self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
    });

    if (self.isExisting() && self.contentId()) {
      upiPayeeModel.retrieveImage(self.contentId()).then(function (data) {
        if (data && data.contentDTOList[0]) { self.preview("data:image/gif;base64," + data.contentDTOList[0].content); }
      });
    }

    self.addPayee = function () {
      if (!Params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      Params.dashboard.loadComponent("review-upi-payee", {});
    };
  };
});

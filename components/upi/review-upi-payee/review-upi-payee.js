define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/create-vpa",
  "ojs/ojknockout",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojavatar",
  "ojs/ojbutton"
], function (oj, ko, upiPayeeModel, ResourceBundle) {
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
    self.payeeId = ko.observable();
    self.payeeGroupPayload = getNewKoModel().payeeGroup;
    self.payeePayload = getNewKoModel().payee;
    self.avatarSize = ko.observable("xs");
    self.initials = ko.observable(oj.IntlConverterUtils.getInitials(self.payeeName().split(/\s+/)[0], self.payeeName().split(/\s+/)[1]));
    Params.baseModel.registerComponent("image-upload", "goals");
    Params.baseModel.registerComponent("transfer-payee-upi", "upi");
    Params.dashboard.headerName(self.nls.upiPayee.header);

    Params.baseModel.registerElement([
      "modal-window",
      "confirm-screen",
      "row"
    ]);

    upiPayeeModel.getPayeeMaintenance().then(function (data) {
      const configurationDetails = {};

      for (let k = 0; k < data.configurationDetails.length; k++) {
        configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
      }

      self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
    });

    self.makeTransfer = function () {
      Params.dashboard.loadComponent("transfer-payee-upi", {});
    };

    self.createPayeeGroup = function () {
      if (self.isExisting()) {
        self.addPayee();

        return;
      }

      self.payeeGroupPayload.name(self.payeeName());
      self.payeeGroupPayload.contentId(self.contentId());

      const groupPayload = ko.toJSON(self.payeeGroupPayload);

      upiPayeeModel.createPayeeGroup(groupPayload).done(function (data) {
        self.payeeGroupId(data.payeeGroup.groupId);
        self.addPayee();
      });
    };

    self.uploadImage = function (event) {
      if (!Params.baseModel.showComponentValidationErrors(document.getElementById("drafttracker"))) {
        return;
      }

      if (self.file()) {
        const form = new FormData();

        form.append("file", self.file());
        form.append("moduleIdentifier", "PAYEE");
        form.append("isShared", "true");

        upiPayeeModel.uploadImage(form).done(function (data) {
          if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
            self.contentId(data.contentDTOList[0].contentId.value);
            self.createPayeeGroup();
          }
        });
      } else {
        self.createPayeeGroup();
      }
    };

    self.addPayee = function () {
      if (!Params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      self.payeePayload.groupId = self.payeeGroupId();
      self.payeePayload.vpaId = self.vpaId();
      self.payeePayload.name = self.payeeName();
      self.payeePayload.nickName = self.nickName();
      self.payeePayload.contentId = self.contentId();
      self.payeePayload.accountName = self.accountName();

      const addPayeePayload = ko.toJSON(self.payeePayload);

      upiPayeeModel.createPayee(addPayeePayload, self.payeeGroupId()).done(function (data, status, jqXHR) {
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: self.nls.upiPayee.header,
          fromPayeeCreation: true,
          confirmScreenExtensions: {
            successMessage: self.nls.confirm.RETAIL_SUCCESS_MESSAGE,
            isSet: true,
            template: "confirm-screen/adhoc-transfer-vpa"
          }
        }, self);
      });
    };
  };
});
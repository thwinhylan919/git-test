define([
    "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/wallet-mobile-verification",
  "ojs/ojknockout",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojcollapsible"
], function(ko, $, WalletModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.validationTracker = ko.observable();

    const getNewKoModel = function() {
      const KoModel = WalletModel.getNewModel();

      KoModel.mobileNumber = ko.observable(KoModel.mobileDTO.mobileNumber);

      return KoModel;
    };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.details = new getNewKoModel().mobileDTO;
    self.label(self.resource.wallet.signup);

    self.save = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      WalletModel.saveModel(ko.toJSON(self.details)).done(function() {
        self.getNextStage();
      });

      let password = true;

      self.togglePassword = function() {
        password = !password;

        const eye = $("#eyecon");

        eye.removeClass("icon-eye icon-eye-slash");

        if (password) {
          eye.addClass("icon-eye-slash");

          $("#otp").prop({
            type: "password"
          });
        } else {
          eye.addClass("icon-eye");

          $("#otp").prop({
            type: "text"
          });
        }
      };
    };
  };
});
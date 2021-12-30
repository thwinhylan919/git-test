define([

  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/forgot-password",
  "ojL10n!resources/nls/change-password",
  "framework/js/plugins/encrypt",
  "ojs/ojinputtext",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function (ko, $, ResetPasswordModel, Constants, resourceBundle, passwordPolicyResourceBundle, Encrypt) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);

    if (Constants.module === "WALLET") {
      self.verificationResponse = ko.observable(rootParams.rootModel.verificationResponse());
    }

    self.nls = resourceBundle;
    self.passwordPolicynls = passwordPolicyResourceBundle;
    self.showConfirmation = ko.observable(false);
    self.enteredNewPassword = ko.observable(true);
    self.pwshown = ko.observable(false);
    self.pwdMinLength = ko.observable();
    self.pwdMaxLength = ko.observable();
    self.nbrUpperAlpha = ko.observable();
    self.nbrLowerAlpha = ko.observable();
    self.nbrNumeric = ko.observable();
    self.nbrSpecial = ko.observable();
    self.specialAllowed = ko.observableArray();
    self.displaypasswordpolicy = ko.observable(false);
    self.newPassword = ko.observable();
    self.confirmPassword = ko.observable();
    self.pwdnullcheck = ko.observable();
    self.cnfmPwdNullCheck = ko.observable();
    self.showPasswordRule1 = ko.observable();
    self.showPasswordRule2 = ko.observable();
    self.showPasswordRule3 = ko.observable();
    self.isTokenValid = ko.observable(false);
    self.response = ko.observableArray();
    self.token = ko.observable();
    self.isDynamicUrl = ko.observable(false);
    rootParams.baseModel.registerComponent("password-validation", "password-policy-validation");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.dashboard.headerName(self.nls.forgotPassword.details.resetPassword);

    let determinantValue;

    self.afterRender = function (root) {
      self.isDynamicUrl(true);
      self.queryMap = root.queryMap;
      self.token = self.queryMap.token;
      determinantValue = root.queryMap.determinantValue;

      $(document).on("focusout", function () {
        rootParams.baseModel.showComponentValidationErrors(self.pwdnullcheck());
      });

      ResetPasswordModel.tokenValidate(self.token,determinantValue, self.isDynamicUrl()).done(function (tokenData) {
        self.isTokenValid(tokenData.token.tokenValid);
      });

        const searchParameters = {
          token: self.token
        };

        ResetPasswordModel.fetchPasswordPolicy(searchParameters,determinantValue, self.isDynamicUrl()).done(function (data) {
          self.response(data.passwordPolicyDTO[0]);

          self.pwdMinLength = ko.observable(self.response().pwdMinLength);
          self.pwdMaxLength = ko.observable(self.response().pwdMaxLength);
          self.nbrUpperAlpha = ko.observable(self.response().nbrUpperAlpha);
          self.nbrLowerAlpha = ko.observable(self.response().nbrLowerAlpha);
          self.nbrNumeric = ko.observable(self.response().nbrNumeric);
          self.nbrSpecial = ko.observable(self.response().nbrSpecial);
          self.specialAllowed = ko.observableArray(self.response().specialAllowed);

          self.showPasswordRule1(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule1, {
            pwdMinLength: self.pwdMinLength(),
            pwdMaxLength: self.pwdMaxLength()
          }));

          self.showPasswordRule2(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule2, {
            nbrNumeric: self.nbrNumeric(),
            nbrUpperAlpha: self.nbrUpperAlpha(),
            nbrLowerAlpha: self.nbrLowerAlpha(),
            nbrSpecial: self.nbrSpecial()
          }));

          self.showPasswordRule3(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule3, {
            specialAllowed: self.specialAllowed().join("")
          }));

          self.displaypasswordpolicy(true);
          ko.tasks.runEarly();

          self.passwordpolicy = function () {
            $("#PasswordPolicy").show();
          };

        });
    };

    self.okClicked = function () {
      $("#PasswordPolicy").hide();
    };

    const getNewKoModel = function () {
      const KoModel = ResetPasswordModel.getNewModel();

      return KoModel;
    };

    self.payload = ko.observable(getNewKoModel());

    self.reset = function () {
      const validationTracker = document.getElementById("validationTracker");

      if (!rootParams.baseModel.showComponentValidationErrors(validationTracker)) {
        return;
      }

      if (!rootParams.baseModel.showComponentValidationErrors(self.pwdnullcheck())) {
        return;
      }

      if (!rootParams.baseModel.showComponentValidationErrors(self.cnfmPwdNullCheck())) {
        return;
      }

      self.payload().userId = self.response().userId;
      self.payload().token = self.token;

      Encrypt(self.newPassword()).then(function (passwords) {
        self.payload().newPassword = passwords[0];

        self.resetPassword(self.payload());
      });
    };

    self.resetPassword = function (payload) {
      ResetPasswordModel.changePassword(ko.toJSON(payload),determinantValue, self.isDynamicUrl()).done(function (data) {
        rootParams.dashboard.isHelpAvailable(false);
        self.response(data);
        self.showConfirmation(true);
        self.enteredNewPassword(false);
      });
    };

    const showPassword = function () {
      $("#pwd").prop({
        type: "text"
      });
    },
      hidePassword = function () {
        $("#pwd").prop({
          type: "password"
        });
      };

    self.showHide = function () {
      if (!self.pwshown()) {
        self.pwshown(true);
        showPassword();
      } else {
        self.pwshown(false);
        hidePassword();
      }
    };

    self.logIn = function () {
      rootParams.baseModel.switchPage({
        module: "login"
      }, false, false, null, true);
    };

    self.cancel = function () {
      rootParams.baseModel.switchPage({
        module: "login"
      }, false, false, null, true);
    };

    self.equalToPassword = {
      validate: function (value) {
        const compareTo = self.newPassword.peek();

        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          self.confirmPassword("");
          throw new Error(self.nls.forgotPassword.messages.passwordMatch);
        }

        return true;
      }
    };

    self.getTemplate = function () {
      return Constants.module === "WALLET" ? "walletTemplate" : "templateDefault";
    };

    self.showPasswordPolicy = function () {
      $("#PasswordPolicy").show();
    };
  };
});
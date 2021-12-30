define([

  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/otp-verification",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojbutton"
], function (ko, $, OTPverificationModel, locale) {
  "use strict";

  return function (Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.locale = locale;
    self.verificationCode = ko.observable();
    self.invalidTracker = ko.observable();
    self.exceedResendMsg = ko.observable(false);
    self.resendMsg = ko.observable(false);
    self.resendCode = ko.observable(0);
    self.attemptsLeft=ko.observable(Params.rootModel.attemptsLeft);
    self.resendattemptsLeft=ko.observable(Params.rootModel.attemptsLeft);
    self.hideResendOTPButton=ko.observable(true);
    self.hideSubmitButton=ko.observable(true);

    /**
     * This function is used to submit the OTP entered by the user.
     * If the OTP entered is valid it will call the callback function sent by the parent component.
     *
     * @function submitOTP
     */
    self.submitOTP = function () {
      if (!Params.baseModel.showComponentValidationErrors(document.getElementById("otp"))) {
        return;
      }

      if(self.attemptsLeft()<=0)
      {
        self.exceedResendMsg(true);
        self.hideSubmitButton(false);
      }
     else{
        if(self.attemptsLeft()<=1)
      {
        self.hideSubmitButton(false);
      }

      OTPverificationModel.submitOTP(Params.baseUrl, self.verificationCode()).done(function (data, status, jqXHR) {
        self.attemptsLeft(self.attemptsLeft()-1);
        Params.baseModel.characterEncoding(data);

        if (self.response) {
          self.response().passwordPolicyDTO = data.passwordPolicyDTO;
        }

        Params.callback(data, status, jqXHR);
      }).fail(function (data) {
        self.attemptsLeft(self.attemptsLeft()-1);

        if (Params.callbackFailure) {
          Params.callbackFailure(data);
        }
      });
    }
    };

    /**
     * This function is used to resend the OTP to the user.
     *
     * @function resendOTP
     */
    self.resendOTP = function () {
      self.resendCode(self.resendCode() + 1);

      if(self.resendCode() === self.resendattemptsLeft()){
        self.hideResendOTPButton(false);
      }

      if (self.resendCode() > self.resendattemptsLeft() || self.attemptsLeft()<=0) {
        self.hideResendOTPButton(false);
        self.resendMsg(false);
        self.exceedResendMsg(true);
      } else if (self.resendCode() <= self.resendattemptsLeft()) {
        self.resendMsg(true);
        OTPverificationModel.resendOTP(Params.baseUrl);
      }
    };

    let password = true;

    /**
     * This function is the toggle the password entered by the user in visible or password format.
     *
     * @function togglePassword
     */
    self.togglePassword = function () {
      password = !password;

      const eye = $("#eyecon");

      eye.removeClass("icon-eye icon-eye-slash");

      if (password) {
        eye.addClass("icon-eye-slash");

        $("#otp input").prop({
          type: "password"
        });
      } else {
        eye.addClass("icon-eye");

        $("#otp input").prop({
          type: "text"
        });
      }
    };

    /**
     * This function is called on the click of the cancel button.
     * It calls the callback function passed as an argument by the parent component.
     *
     * @function cancel
     */
    self.cancel = function () {
      if (Params.cancelCallback) {
        Params.cancelCallback();
      } else {
        history.back();
      }
    };

    self.getTemplate = function () {
      if (Params.templateDefault) {
        return "templateDefault";
      }

      return "popupTemplate";
    };
  };
});
define([
  "knockout",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/forgot-password",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojvalidation",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation",
  "ojs/ojdatetimepicker"
], function (ko, UserInformationModel, Constants, resourceBundle) {
  "use strict";

  return function viewModel(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.userId = ko.observable();
    self.response = ko.observable();
    self.nls = resourceBundle;
    self.verificationResponse = ko.observable();
    self.forgotPassword = ko.observable(true);
    self.customComponentName = ko.observable();
    self.verification = ko.observable(false);
    self.userInformation = ko.observable(true);
    self.validationTracker = ko.observable();
    self.baseURL = ko.observable();
    self.dateOfBirth = ko.observable();
    rootParams.baseModel.registerComponent("otp-verification", "base-components");
    rootParams.baseModel.registerComponent("reset-password", "recovery");
    rootParams.dashboard.headerName(self.nls.forgotPassword.headerName);
    self.headerMessages = ko.observableArray();
    self.emailDispatched = ko.observable(false);

    self.headerMessages.push({
      icon: "dashboard/confirmation.svg",
      headerMessage: self.nls.forgotPassword.header.success,
      summaryMessage: self.nls.forgotPassword.details.summaryMessage,
      headerStyle: "successHeader"
  });

    self.verify = function () {
      Promise.all([UserInformationModel.sessionRequest()])
        .then(function () {
          UserInformationModel.nonceRequest().done(function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
              return;
            }

            const payload = ko.toJSON({
              userId: self.userId(),
              dateOfBirth: self.dateOfBirth()
            });

            UserInformationModel.updatePasswordRequest(payload).done(function (data) {
              self.response(data);
              self.verificationResponse(data);

              if (Constants.module === "WALLET") {
                self.customComponentName("reset-password");
                self.forgotPassword(false);
              } else {
               self.emailDispatched(true);
              }
            });
          });
        });
    };

    self.loginRedirect = function () {
      rootParams.baseModel.switchPage({
        module: "login"
      }, false, false, null, true);
    };

    self.cancelClicked = function () {
      rootParams.baseModel.switchPage({
        module: "login"
      }, false, false, null, true);
    };
  };
});
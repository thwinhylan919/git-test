define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/forgot-user",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation",
  "ojs/ojdatetimepicker",
  "ojs/ojtimezonedata"
], function (oj, ko, UserIdRecoveryInfoModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.emailId = ko.observable();
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.forgotUserId.header.forgotUserName);
    self.validationTracker = ko.observable();
    self.verification = ko.observable(false);
    self.userInformation = ko.observable(true);
    self.dateOfBirth = ko.observable();
    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
    self.headerMessages = ko.observableArray();

    self.headerMessages.push({
      icon: "dashboard/confirmation.svg",
      headerMessage: self.nls.forgotUserId.header.success,
      summaryMessage: self.nls.forgotUserId.messages.usernameEmail,
      headerStyle: "successHeader"
  });

    self.verify = function () {
      Promise.all([UserIdRecoveryInfoModel.sessionRequest()])
      .then(function () {
        UserIdRecoveryInfoModel.nonceRequest().done(function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      const payload = ko.toJSON({
        emailId: self.emailId(),
        dateOfBirth: self.dateOfBirth
      });

      UserIdRecoveryInfoModel.userIdRecoveryRequest(payload).done(function () {
        self.userInformation(false);
        self.verification(true);
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
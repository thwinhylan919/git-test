define([

  "knockout",
  "jquery",
  "ojL10n!resources/nls/account-snapshot-registration",
  "baseLogger"
], function (ko, $, ResourceBundle, BaseLogger) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.allowSnapshot = ko.observable(false);
    rootParams.dashboard.headerName(self.resource.header);

    const dummyFunction = function () {
      BaseLogger.info("this is a dummy function");
    };

    self.proceed = function () {
      self.allowSnapshot(true);
      $("#requestPermision").trigger("closeModal");

      const registerationSuccessfulCallback = function () {
        rootParams.baseModel.registerComponent("login-form", "widgets/pre-login");

        rootParams.dashboard.loadComponent("login-form", {
          landingModule: "accounts",
          landingComponent: "account-snapshot",
          hideMobileLanding: true,
          params: self
        });
      };

      window.plugins.appPreferences.store(registerationSuccessfulCallback, dummyFunction, "account_snapshot_status", "PENDING");
    };

    self.dontProceed = function () {
      self.allowSnapshot(false);
      $("#requestPermision").trigger("closeModal");

      const registerationSuccessfulCallback = function () {
        rootParams.baseModel.registerComponent("login-form", "widgets/pre-login");

        rootParams.dashboard.loadComponent("login-form", {
          landingModule: "accounts",
          landingComponent: "account-snapshot",
          hideMobileLanding: true,
          params: self
        });
      };

      window.plugins.appPreferences.store(registerationSuccessfulCallback, dummyFunction, "account_snapshot_status", "PENDING");
    };

    self.enableQuickSnapshot = function () {
      window.Wearable.onConnect(function () {
        $("#requestPermision").trigger("openModal");
      }, function () {
        const registerationSuccessfulCallback = function () {
          rootParams.baseModel.registerComponent("login-form", "widgets/pre-login");

          rootParams.dashboard.loadComponent("login-form", {
            landingModule: "accounts",
            landingComponent: "account-snapshot",
            hideMobileLanding: true,
            params: self
          });
        };

        window.plugins.appPreferences.store(registerationSuccessfulCallback, dummyFunction, "account_snapshot_status", "PENDING");
      });
    };
  };
});
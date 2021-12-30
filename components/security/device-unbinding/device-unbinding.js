define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/device-unbinding",
  "baseLogger",
  "ojs/ojswitch"
], function (ko, Model, ResourceBundle, BaseLogger) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.settings);
    self.androidDevice = ko.observable(false);
    self.androidDisabled = ko.observable(true);
    self.iOsDevice = ko.observable(false);
    self.iOsDisabled = ko.observable(true);

    Model.getDeviceCount().then(function (data) {
      ko.utils.arrayForEach(data.listDTO, function (item) {
        if (item.os === "ANDROID" && item.count > 0) {
          self.androidDevice(true);
          self.androidDisabled(false);
        }

        if (item.os === "IOS" && item.count > 0) {
          self.iOsDevice(true);
          self.iOsDisabled(false);
        }
      });
    });

    self.androidDevice.subscribe(function (newValue) {
      if (!newValue) {
        Model.unregisterDevices("ANDROID").then(function () {
          self.androidDisabled(true);
          self.deletePreference();
        });
      }
    });

    self.iOsDevice.subscribe(function (newValue) {
      if (!newValue) {
        Model.unregisterDevices("IOS").then(function () {
          self.iOsDisabled(true);
          self.deletePreference();
        });
      }
    });

    self.deletePreference = function () {
      const successCallBack = function () {
          BaseLogger.error("SUCCESS IN DELETING ALTERNATE LOGIN PREFERENCE");
        },
        failureCallBack = function () {
          BaseLogger.error("FAILURE IN DELETING ALTERNATE LOGIN PREFERENCE");
        };

      window.plugins.appPreferences.remove(successCallBack, failureCallBack, "alternate_preference");
    };
  };
});
define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/wearable-device-unbinding",
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

    const dummyFunction = function () {
      BaseLogger.info("this is a dummy function");
    };

    Model.getDeviceCount().then(function (data) {
      ko.utils.arrayForEach(data.listDTO, function (item) {
        if (item.os === "ANDROID_WEAR" && item.count > 0) {
          self.androidDevice(true);
          self.androidDisabled(false);
        }

        if (item.os === "IOS_WEAR" && item.count > 0) {
          self.iOsDevice(true);
          self.iOsDisabled(false);
        }
      });
    });

    self.androidDevice.subscribe(function (newValue) {
      if (!newValue) {
        Model.unregisterDevices("ANDROID_WEAR").then(function () {
          self.androidDisabled(true);
        });
      }
    });

    self.iOsDevice.subscribe(function (newValue) {
      if (!newValue) {
        Model.unregisterDevices("IOS_WEAR").then(function () {
          const wearableEnabled = {};

          wearableEnabled.isRegistered = "DEREGISTERED";
          window.Wearable.watchRegistered(dummyFunction, dummyFunction, wearableEnabled);
          self.iOsDisabled(true);
        });
      }
    });
  };
});
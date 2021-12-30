define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/confirm-wearable-pin",
  "./model",
  "baseLogger",
  "ojs/ojvalidation",
  "ojs/ojbutton"
], function (ko, $, ResourceBundle, Model, BaseLogger) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.confirmPin);
    self.invalidTracker = ko.observable();

    /**
     * Let dummyFunction - It is a dummy function whihc does nothing.
     *
     * @return {void}  It returns nothing.
     */
    const dummyFunction = function () {
      BaseLogger.info("this is a dummy function");
    };

    window.plugins.appPreferences.fetch(function (value) {
      if (value === "REGISTERED") {
        window.plugins.auth.snapshot.fetch({
          pin: "SNAPSHOT"
        }, function (snapshotToken) {
          self.snapshotToken = snapshotToken;
        }, dummyFunction);
      }
    }, function () {
      BaseLogger.info("account snapshot failed");
    }, "account_snapshot_status");

    $("#confirmPin").ready(function () {
      $("#confirmPin").attr("type", "tel");
    });

    /**
     *THis this is the click handler for the back button on confirm pin.
     *@Function back
     *@return {void}.
     */
    self.back = function () {
      rootParams.dashboard.hideDetails();
    };

    /**
     *THis this is the click handler for the proceed button on confirm pin.
     *@Function proceed
     *@return {void}.
     */
    self.proceed = function () {
      $("#requestPermision").trigger("closeModal");

      window.Wearable.onConnect(function (resultObj) {
        let payload = {};

        payload.secureDeviceId = resultObj.wear_id;
        payload.osVersion = resultObj.wear_sdk;
        payload.os = rootParams.baseModel.cordovaDevice() + "_WEAR";
        payload.manufacturer = resultObj.wear_manufacturer;
        payload.model = resultObj.wear_model;
        payload = ko.mapping.toJSON(payload);

        Model.registerDevice(payload).done(function () {
          let wearablePayload = {
            jwt: self.params.JWTToken,
            pin: self.params.setPin()
          };

          if (self.snapshotToken) {
            wearablePayload.snapshotJwt = self.snapshotToken;
          }

          wearablePayload = ko.mapping.toJSON(wearablePayload);

          window.Wearable.sendTokens(function () {
            const wearableEnabled = {};

            wearableEnabled.isRegistered = "REGISTERED";
            window.Wearable.watchRegistered(dummyFunction, dummyFunction, wearableEnabled);
            rootParams.baseModel.registerElement("confirm-screen");

            rootParams.dashboard.loadComponent("confirm-screen", {
              jqXHR: {
                status: 200,
                responseJSON: {
                  status: {
                    referenceNumber: ""
                  }
                }
              },
              hostReferenceNumber: "",
              transactionName: rootParams.dashboard.headerName(),
              template: "confirm-screen/security"
            }, self);
          }, function (error) {
            rootParams.baseModel.showMessages(null, [self.resource.error[error]], "ERROR");
          }, wearablePayload);
        });
      }, function (error) {
        rootParams.baseModel.showMessages(null, [self.resource.error[error]], "ERROR");
      });
    };

    /**
     *THis this is the click handler for the proceed button on confirm pin.
     *@Function confirmPinProceed
     *@param {Object} event - is the event
     *@return {void}.
     */
    self.confirmPinProceed = function (event) {
      if (event.detail.value.length === self.params.maxlength()) {
        if (self.params.setPin() === event.detail.value) {
          const re = new RegExp("^([0-9]{4})$");

          if (re.test(event.detail.value)) {
            $("#requestPermision").trigger("openModal");
          } else {
            rootParams.baseModel.showMessages(null, [self.resource.pinShouldhaveOnlyNumber], "ERROR");
            $(".set-pin").find("input").val("");
          }
        } else {
          rootParams.baseModel.showMessages(null, [self.resource.pinDidntMatch], "ERROR");
          $(".set-pin").find("input").val("");
        }
      }
    };
  };
});
define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/pin-login",
    "baseLogger",
    "load!./pin-pattern-max-attempts.json",
    "platform"
], function (ko, $, resourceBundle, BaseLogger, MaxAttempts, Platform) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.pin = ko.observable();
        self.maxlength = rootParams.data.lengthOfPin;
        self.error = ko.observable("");

        const errorAppPreference = function () {
            BaseLogger.error("error in getting or setting app preference");
        };

        self.closeDialog = function () {
            $("#pinLogin").hide();
        };

        $("#enterPin").ready(function () {
            $("#enterPin").attr("type", "tel");
            $("#enterPin input").addClass("white-input");

        });

        self.pinLoginProceed = function (event) {
            self.error("");

            if (event.detail.value.length === parseInt(rootParams.data.lengthOfPin)) {
                self.pin(event.detail.value);

                $("#enterPin").prop({
                    disabled: false
                });

                self.getStoredToken();
            }
        };

        self.getStoredToken = function () {
            function successCallback(result) {
                self.error(self.resource.loading);
                self.storedJWT(result);

                window.plugins.appPreferences.store(function () {
                    Platform.getInstance().then(function (platform) {
                        const serverType = self[platform("getServerType")];

                        serverType.validateJWTToken();
                    });
                }, errorAppPreference, "max_attempts", MaxAttempts.maxAttempts);
            }

            function errorCallback() {
                window.plugins.appPreferences.fetch(function (maxAttempts) {
                    if (parseInt(maxAttempts) < 1) {
                        self.deleteSecret(self.resource.maximumRetrysExceeded);
                        self.closeDialog();

                        self.accessService({
                            accessToken: self.pin()
                        }, true);
                    } else {
                        const dummyFunction = function () {
                            BaseLogger.info("this is a dummy function");
                        };

                        window.plugins.appPreferences.store(dummyFunction, errorAppPreference, "max_attempts", parseInt(maxAttempts) - 1);
                    }

                    $("#enterPin").removeClass("white-input");
                    $("#enterPin input").addClass("red-input");
                    $(".set-pin-input").find("input").val("");

                    setTimeout(function () {
                        self.pin("");

                        $("#enterPin").removeClass("red-input").addClass("white-input").prop({
                            disabled: false
                        });
                    }, 500);
                }, errorAppPreference, "max_attempts");
            }

            window.plugins.auth.pin.verify({
                pin: self.pin()
            }, successCallback, errorCallback);
        };
    };
});
define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/pattern-login",
    "baseLogger",
    "load!./pin-pattern-max-attempts.json",
    "platform"
], function(ko, $, resourceBundle, BaseLogger, MaxAttempts, Platform) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.error = ko.observable("");
        self.containerId = "patternContainerLogin" + rootParams.baseModel.incrementIdCount();

        let pattern,
            lockSet;
        const errorAppPreference = function() {
            BaseLogger.error("error in getting or setting app preference");
        };

        function patternEntered(value) {
            pattern = value;
            self.error(self.resource.loading);
            self.getStoredTokenAndLogin();
        }

        require(["thirdPartyLibs/patternLock/patternLock", "css!thirdPartyLibs/patternLock/patternLock"], function(PatternLock) {
            lockSet = new PatternLock("#" + self.containerId, {
                radius: 20,
                onDraw: patternEntered,
                patternVisible: !!(rootParams.data && rootParams.data.patternVisible === "visible")
            });
        });

        self.closeDialog = function() {
            $("#patternLogin").hide();
        };

        self.getStoredTokenAndLogin = function() {
            function successCallback(result) {
                self.storedJWT(result);

                window.plugins.appPreferences.store(function() {
                    Platform.getInstance().then(function(platform) {
                        const serverType = self[platform("getServerType")];

                        serverType.validateJWTToken();
                    });
                }, errorAppPreference, "max_attempts", MaxAttempts.maxAttempts);

                setTimeout(function() {
                    lockSet.reset();
                }, 500);
            }

            function errorCallback() {
                window.plugins.appPreferences.fetch(function(maxAttempts) {
                    if (parseInt(maxAttempts) < 1) {
                        self.deleteSecret(self.resource.maximumRetrysExceeded);
                        self.closeDialog();

                        self.accessService({
                            accessToken: pattern
                        }, true);
                    } else {
                        const dummyFunction = function() {
                            BaseLogger.info("this is a dummy function");
                        };

                        window.plugins.appPreferences.store(dummyFunction, errorAppPreference, "max_attempts", parseInt(maxAttempts) - 1);
                    }

                    lockSet.error();

                    setTimeout(function() {
                        lockSet.reset();
                    }, 500);

                    self.error(self.resource.invalidPattern);
                }, errorAppPreference, "max_attempts");
            }

            window.plugins.auth.pattern.verify({
                pin: pattern
            }, successCallback, errorCallback);
        };
    };
});
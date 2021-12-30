define([
    "knockout",
    "ojL10n!resources/nls/set-pattern",
    "load!./pin-pattern-max-attempts.json",
    "baseLogger"
], function (ko, ResourceBundle, MaxAttempts, baseLogger) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.patternLock);
        self.patternVisible = ko.observable();
        self.setPattern = ko.observable();

        let lockSet, mechanism;

        function dummyFunction() {
            baseLogger.info("this is a dummy function");
        }

        const patternVisisblitySubscription = self.patternVisible.subscribe(function (newValue) {
            if (newValue) {
                mechanism = "pattern-invisible";
            } else {
                mechanism = "pattern";
            }
        });

        self.dispose = function () {
            patternVisisblitySubscription.dispose();
        };

        self.appendPatternLock = function () {
            const setPinOnDraw = function (pattern) {
                self.setPattern(pattern);
            };

            require(["thirdPartyLibs/patternLock/patternLock", "css!thirdPartyLibs/patternLock/patternLock"], function (PatternLock) {
                lockSet = new PatternLock("#patternContainerSet", {
                    radius: 20,
                    onDraw: setPinOnDraw,
                    patternVisible: true
                });
            });
        };

        self.appendPatternLock();

        self.enrollUser = function (secret) {
            mechanism = mechanism || "pattern";

            const errorCallback = function () {
                    rootParams.baseModel.showMessages(null, [self.resource.couldntSetupPattern], "ERROR");
                    self.goToDashboardOrConfirmScreen();
                },
                successCallback = function () {
                    window.plugins.appPreferences.store(function () {
                        window.plugins.auth.owner.set({
                            password: rootParams.dashboard.userData.userProfile.userName
                        }).then(function () {
                            window.plugins.appPreferences.store(dummyFunction, dummyFunction, "max_attempts", MaxAttempts.maxAttempts);
                            self.goToDashboardOrConfirmScreen();
                        });
                    }, errorCallback, "alternate_preference", mechanism);
                };

            window.plugins.auth.pattern.save({
                pin: self.setPattern(),
                password: secret
            }, successCallback, errorCallback);
        };

        self.undoSetPin = function () {
            lockSet.reset();
            self.setPattern("");
        };

        self.back = function () {
            rootParams.dashboard.hideDetails();
        };

        self.proceedForSetPattern = function () {
            if (self.setPattern().length > 3) {
                rootParams.baseModel.registerComponent("confirm-pattern", "security");

                rootParams.dashboard.loadComponent("confirm-pattern", {
                    setPattern: self.setPattern,
                    enrollUser: self.enrollUser,
                    JWTToken: rootParams.data.JWTToken,
                    baseModel: rootParams.baseModel,
                    genericViewModel: rootParams.genericViewModel
                });
            } else {
                rootParams.baseModel.showMessages(null, [self.resource.pleaseEnterPattern], "ERROR");
            }
        };

        self.cancelClickHandler = function () {
            rootParams.genericViewModel.resetLayout();
        };

        self.cancelSetPattern = function () {
            if (rootParams.dashboard.appData.segment === "ANON") {
                self.changeUserSegment(self.userSegment, rootParams.dashboard.userData, self.landingModule);
            } else {
                rootParams.dashboard.switchModule(self.dashboardRole(), true);
            }
        };
    };
});
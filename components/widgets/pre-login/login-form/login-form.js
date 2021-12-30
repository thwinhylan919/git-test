define([
    "knockout",
    "ojL10n!resources/nls/login-form",
    "baseLogger",
    "ojs/ojswitch"
], function (ko, ResourceBundle, BaseLogger) {
    "use strict";

    return function (rootParams) {
        const self = this;

        rootParams.baseModel.registerComponent("login-options", "login");
        rootParams.baseModel.registerComponent("pin-login", "login");
        rootParams.baseModel.registerElement("virtual-keyboard");
        rootParams.baseModel.registerComponent("mobile-landing", "home");
        self.username = ko.observable();
        self.isLarge = ko.observable("oj-flex");
        self.password = ko.observable();
        self.message = ko.observable();
        self.allowSnapshot = ko.observable();
        self.hideMobileLanding = ko.observable();
        self.goToLogin = ko.observable(true);
        self.isPushoobAllowed = ko.observable();
        self.notificationData = ko.observable();
        self.nls = ResourceBundle;
        self.showPopup = true;

        if (!rootParams.baseModel.large() || rootParams.baseModel.cordovaDevice()) {
            self.showPopup = false;
        }

        if (rootParams.data && rootParams.data.data && rootParams.data.data.landingModule) {
            self.landingModule = rootParams.data.data.landingModule;
            self.landingComponent = rootParams.data.data.landingModule;
        } else if (rootParams.rootModel && rootParams.rootModel.params && rootParams.rootModel.params.landingModule) {
            self.landingModule = rootParams.rootModel.params.landingModule;
            self.landingComponent = rootParams.rootModel.params.landingComponent;
            self.allowSnapshot(rootParams.rootModel.params.params.allowSnapshot);
            self.hideMobileLanding(rootParams.rootModel.params.hideMobileLanding);
        }

        self.cancelLogin = function () {
            history.back();
        };

        if (rootParams.baseModel.cordovaDevice()) {
            self.goToLogin(false);
            self.isLarge("oj-flex oj-lg-flex-items-initial oj-lg-justify-content-center oj-md-flex-items-initial oj-md-justify-content-center");

            const successcallback = function (data) {
                const successcall = function () {
                    self.type = "login-form-mobile";
                    self.goToLogin(true);
                    rootParams.baseModel.registerComponent(self.type, "login");
                },
                    errorcall = function () {
                        BaseLogger.error("ERROR IN DELETING THE DATA");
                        self.type = "login-form-mobile";
                        self.goToLogin(true);
                        self.hideMobileLanding(false);
                        rootParams.baseModel.registerComponent(self.type, "login");
                    };

                if (data) {
                    self.notificationData(JSON.parse(data));
                    self.isPushoobAllowed(true);
                    self.hideMobileLanding(true);
                    window.plugins.appPreferences.remove(successcall, errorcall, "oob_token_data");
                } else {
                    self.type = "login-form-mobile";
                    self.goToLogin(true);
                    rootParams.baseModel.registerComponent(self.type, "login");
                }
            },
                errorcallback = function () {
                    BaseLogger.error("ERROR IN FETCHING THE DATA");
                    self.type = "login-form-mobile";
                    self.goToLogin(true);
                    self.hideMobileLanding(false);
                    rootParams.baseModel.registerComponent(self.type, "login");
                };

            window.plugins.appPreferences.fetch(successcallback, errorcallback, "oob_token_data");
        } else {
            self.type = "login-form-web";
            self.hideMobileLanding(false);
            rootParams.baseModel.registerComponent(self.type, "login");
        }
    };
});
define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/profile"
], function(ko, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        let genericViewModel, password = true;

        self.nls = resourceBundle;
        self.showComponent = ko.observable();
        self.show = ko.observable(false);

        const authTypes = {
            OTP: "otp-screen",
            T_SOFT_TOKEN: "time-based-otp-screen",
            SEC_QUE: "security-questions",
            R_SOFT_TOKEN: "hotp-screen",
            PUSH_OOB: "push-out-of-band"
        };

        rootParams.baseModel.registerElement("otp-screen", "2fa");
        rootParams.baseModel.registerElement("time-based-otp-screen", "2fa");
        rootParams.baseModel.registerElement("security-questions", "2fa");
        rootParams.baseModel.registerElement("hotp-screen", "2fa");
        rootParams.baseModel.registerComponent("push-out-of-band", "push-out-of-band");
        rootParams.baseModel.registerElement("modal-window");
        self.showInModalWindow = ko.observable(rootParams.rootModel.currentContext.showInModalWindow);

        self.twoFactorViewModel = {
            challenge: JSON.parse(rootParams.rootModel.serverResponse.getResponseHeader("X-CHALLENGE")),
            togglePassword: function() {
                password = !password;

                const eye = $("#eyecon");

                eye.removeClass("icon-eye icon-eye-slash");

                if (password) {
                    eye.addClass("icon-eye-slash");

                    $("oj-input-password[obdx-type='otp'] > input").prop({
                        type: "password"
                    });
                } else {
                    eye.addClass("icon-eye");

                    $("oj-input-password[obdx-type='otp'] > input").prop({
                        type: "text"
                    });
                }
            },
            submit2fa: function(authenticationRequest) {
                authenticationRequest.authType = self.twoFactorViewModel.challenge.authType;
                rootParams.rootModel.currentContext.headers["X-CHALLENGE_RESPONSE"] = JSON.stringify(authenticationRequest);
                rootParams.rootModel.currentContext.showMessage = true;

                rootParams.rootModel.fireRequest(rootParams.rootModel.currentContext).then(function(data) {
                    rootParams.rootModel.currentContext.promiseResolve(data);
                });
            },
            cancelAuthenticationScreen: function() {
                if (!genericViewModel.menuNavigationAvailable) {
                    return $(document).trigger("2facancelled");
                }

                rootParams.baseModel.onTFAScreen(false);

                if (!genericViewModel.isUserDataSet()) {
                    window.dispatchEvent(new CustomEvent("logout"));
                } else {
                    history.back();
                }
            }
        };

        self.afterRender = function($root) {
            genericViewModel = $root;
            $(".button-container").hide();
            $("#generic-authentication .button-container").show();
        };

        self.openModal = function() {
            $("#verification").trigger("openModal");
        };

        rootParams.rootModel.currentContext.success = function() {
            rootParams.baseModel.onTFAScreen(false);

            if (rootParams.rootModel.originalSuccess) {
                return rootParams.rootModel.originalSuccess.apply(this, Array.prototype.slice.call(arguments));
            }
        };

        rootParams.rootModel.currentContext.error = function(jqXHR) {
            rootParams.baseModel.onTFAScreen(false);
            ko.tasks.runEarly();

            if (rootParams.rootModel.originalError && jqXHR.status !== 417) {
                return rootParams.rootModel.originalError.apply(this, Array.prototype.slice.call(arguments));
            }
        };

        self.show(false);
        ko.tasks.runEarly();
        self.showComponent(authTypes[self.twoFactorViewModel.challenge.authType]);
        self.show(true);

        self.dispose = function() {
            $(".button-container").show();
        };
    };
});
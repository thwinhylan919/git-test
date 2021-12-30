define([
    "knockout",
    "jquery",
    "./model",
    "framework/js/configurations/config",
    "ojL10n!resources/nls/registration-user-create",
    "ojL10n!resources/nls/change-password",
    "framework/js/plugins/encrypt",
    "ojs/ojvalidation",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset"
], function(ko, $, UserCreationModel, Configurations, resourceBundle, passwordPolicyResourceBundle, Encrypt) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        ko.utils.extend(self, rootParams.data);
        self.response = ko.observable();
        self.agreement = ko.observableArray();
        self.nls = resourceBundle;
        self.passwordPolicynls = passwordPolicyResourceBundle;
        self.clickedSignUp = ko.observable(true);
        self.showFinalMessage = ko.observable(false);
        self.pwdMinLength = ko.observable();
        self.pwdMaxLength = ko.observable();
        self.nbrUpperAlpha = ko.observable();
        self.nbrLowerAlpha = ko.observable();
        self.nbrNumeric = ko.observable();
        self.nbrSpecial = ko.observable();
        self.specialAllowed = ko.observableArray();
        self.displaypasswordpolicy = ko.observable();
        self.validationTracker = ko.observable();
        self.newPassword = ko.observable();
        self.confirmPassword = ko.observable();
        rootParams.baseModel.registerComponent("password-validation", "password-policy-validation");
        self.pwshown = ko.observable(false);
        self.usernameValidation = ko.observable();
        self.pwdValidation = ko.observable();
        self.cnfmPwdValidation = ko.observable();
        self.showPasswordRule1 = ko.observable();
        self.showPasswordRule2 = ko.observable();
        self.showPasswordRule3 = ko.observable();
        rootParams.dashboard.headerName(self.nls.registration.headerName);

        self.pageRendered = function (data){
            self.registrationId = ko.observable(data.queryMap.registrationId);
        };

        UserCreationModel.fetchPasswordPolicy().done(function (data) {
            if (data) {

                if (self.response) {
                    self.response(data.passwordPolicyDTO[0]);
                }

                const pwdProps = data.passwordPolicyDTO;

                self.pwdMinLength = ko.observable(pwdProps[0].pwdMinLength);
                self.pwdMaxLength = ko.observable(pwdProps[0].pwdMaxLength);
                self.nbrUpperAlpha = ko.observable(pwdProps[0].nbrUpperAlpha);
                self.nbrLowerAlpha = ko.observable(pwdProps[0].nbrLowerAlpha);
                self.nbrNumeric = ko.observable(pwdProps[0].nbrNumeric);
                self.nbrSpecial = ko.observable(pwdProps[0].nbrSpecial);
                self.specialAllowed = ko.observableArray(pwdProps[0].specialAllowed);

                self.showPasswordRule1(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule1, {
                    pwdMinLength: self.pwdMinLength(),
                    pwdMaxLength: self.pwdMaxLength()
                }));

                self.showPasswordRule2(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule2, {
                    nbrNumeric: self.nbrNumeric(),
                    nbrUpperAlpha: self.nbrUpperAlpha(),
                    nbrLowerAlpha: self.nbrLowerAlpha(),
                    nbrSpecial: self.nbrSpecial()
                }));

                self.showPasswordRule3(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule3, {
                    specialAllowed: self.specialAllowed().join("")
                }));

                const msg = "<html><ul><li>" + self.showPasswordRule1() + "<br><br></li><li>" + self.showPasswordRule2() + "<br><br></li><li>" + self.showPasswordRule3() + "</li></ul></html>";

                self.displaypasswordpolicy(msg);
            }
        });

        const getNewKoModel = function() {
            const KoModel = UserCreationModel.getNewModel();

            return KoModel;
        };

        self.payload = ko.observable(getNewKoModel());

        $(document).on("focusout", function() {
            if (rootParams.baseModel.showComponentValidationErrors(self.usernameValidation())) {
                rootParams.baseModel.showComponentValidationErrors(self.pwdValidation());
            }
        });

        self.signUp = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            self.payload().registrationId = self.registrationId();

            if (Configurations.authentication.type === "OBDXAuthenticator") {
                Encrypt(self.newPassword()).then(function(password) {
                    self.payload().password = encodeURIComponent(password[0]);

                        UserCreationModel.createLogIn(self.registrationId(), ko.toJSON(self.payload())).done(function (data) {
                            rootParams.dashboard.isHelpAvailable(false);
                            self.response(data);
                            self.clickedSignUp(false);
                            self.showFinalMessage(true);
                        });
                });
            } else {
                self.payload().password = self.newPassword();

                if (self.agreement()[0]) {
                    UserCreationModel.createLogIn(self.response().registrationDTO.registrationId, ko.toJSON(self.payload())).done(function(data) {
                        rootParams.dashboard.isHelpAvailable(false);
                        self.response(data);
                        self.clickedSignUp(false);
                        self.showFinalMessage(true);
                    });
                }
            }

        };

        const showPassword = function() {
                $("#pwd").prop({
                    type: "text"
                });
            },
            hidePassword = function() {
                $("#pwd").prop({
                    type: "password"
                });
            };

        self.showHide = function() {
            if (!self.pwshown()) {
                self.pwshown(true);
                showPassword();
            } else {
                self.pwshown(false);
                hidePassword();
            }
        };

        self.cancel = function() {
            location.replace("index.html");
        };

        self.logIn = function() {
            window.dispatchEvent(new CustomEvent("login"));
        };

        self.equalToPassword = {
            validate: function(value) {
                const compareTo = self.newPassword.peek();

                if (!value && !compareTo) {
                    return true;
                } else if (value !== compareTo) {
                    self.confirmPassword("");
                    throw new Error(self.nls.registration.logIn.passwordMatch);
                }

                return true;
            }
        };
    };
});
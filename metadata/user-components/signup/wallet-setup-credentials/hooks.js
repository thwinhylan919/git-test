define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function walletsregistrationpostCall(payload, config) {
            return Model.walletsregistrationpost(payload, config);
        }

                function usersuserIdexistsgetCall(userId, payload, config) {
            return Model.usersuserIdexistsget(userId, payload, config);
        }

                function passwordPolicygetCall(name, description, token, roles, payload, config) {
            return Model.passwordPolicyget(name, description, token, roles, payload, config);
        }

                function walletsregistrationregistrationIdcredentialspostCall(registrationId, payload, config) {
            return Model.walletsregistrationregistrationIdcredentialspost(registrationId, payload, config);
        }

                function onClickSubmit89() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            const registrationID = self.modelInstance.walletsregistrationpostv1payload.registrationId;

            require(["framework/js/plugins/encrypt"], function (Encrypt) {
                Encrypt(self.newPassword()).then(function (passwords) {
                    self.newPassword(passwords[0]);
                    self.modelInstance.walletsregistrationpostv1payload.password(self.newPassword());
                    self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
                }).then(function () {
                    walletsregistrationregistrationIdcredentialspostCall(registrationID, ko.toJSON(self.allDetails)).then(function (response) {
                        if (response) {
                            params.dashboard.loadComponent("wallet-success", "signup");
                        }
                    });
                });
            });
        }

                function onClickBack79() {
            self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
            params.dashboard.loadComponent("wallet-address-details", { allDetails: self.allDetails });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function () {
                return true;
            };

            self.allDetails = params.rootModel.params.allDetails;
            params.baseModel.registerComponent("wallet-success", "signup");
            params.baseModel.registerComponent("wallet-address-details", "signup");
            self.confirmPassword = ko.observable();
            self.useridplaceholder = ko.observable(self.nls.placeholder.userID);
            self.confirmpasswrdplaceholder = ko.observable(self.nls.placeholder.confirmPassword);
            self.passwrdplaceholder = ko.observable(self.nls.placeholder.password);

            if (self.allDetails) {
                const emailid = self.allDetails.emailId();

                if (!self.allDetails.userId()) {
                    self.allDetails.userId(emailid);
                }

                self.modelInstance.walletsregistrationpostv1payload = self.allDetails;
            }

            self.passwordpolicyloaded = ko.observable(false);
            self.invalidTrackerOldPwd = ko.observable();
            self.invalidTrackerNewPwd = ko.observable();
            self.invalidTrackerCnfmPwd = ko.observable();
            self.pwdMinLength = ko.observable();
            self.validationTracker = ko.observable();
            self.pwdMaxLength = ko.observable();
            self.nbrUpperAlpha = ko.observable();
            self.nbrLowerAlpha = ko.observable();
            self.nbrNumeric = ko.observable();
            self.nbrSpecial = ko.observable();
            self.specialAllowed = ko.observableArray();
            self.message = ko.observable();
            self.response = ko.observable();
            self.newPassword = ko.observable();
            self.oldPassword = ko.observable();
            self.mandatoryUpper = ko.observableArray();
            self.mandatoryLower = ko.observableArray();
            self.mandatoryNumber = ko.observableArray();
            self.mandatorySpecialChar = ko.observableArray();
            self.specialCharlist = ko.observableArray();
            self.showPasswordRule1 = ko.observable();
            self.showPasswordRule2 = ko.observable();
            self.showPasswordRule3 = ko.observable();
            self.showPasswordRule4 = ko.observable();
            self.showPasswordRule8 = ko.observable();
            self.showPasswordRule6 = ko.observable();
            self.showPasswordRule7 = ko.observable();
            self.showPasswordRule5 = ko.observable();
            self.notNumber = ko.observable();
            self.passwordRule1 = ko.observable();
            self.roles = ko.observableArray();
            self.isnbrAllowed = ko.observable();
            self.isUpperAllowed = ko.observable();
            self.isLowerAllowed = ko.observable();
            self.isSpecialCharAllowed = ko.observable();
            self.forceChangePassword = ko.observable(true);
            self.charIncluded = ko.observableArray();
            self.nbrCharIncluded = ko.observableArray();
            self.nbrSuccessiveChars = ko.observable();
            self.nbrRepeativeChars = ko.observable();
            self.personalDetExclude = ko.observableArray();
            self.pwdHistorySize = ko.observable();
            self.policy1violated = ko.observable(false);
            self.policy5violated = ko.observable(false);
            self.policy3violated = ko.observable(false);
            self.setNewPass = ko.observable(true);
            self.policy2violated = ko.observable();
            self.policy7violated = ko.observable(false);
            self.policy4violated = ko.observable(false);
            self.policy8violated = ko.observable(false);
            self.policy6violated = ko.observable(false);
            self.excludedDictWords = ko.observableArray();
            self.pwdValidated = ko.observable(false);
            self.passwordPolicyLoaded = ko.observable(false);

            self.notEqualToNewPassword = {
                validate: function (value) {
                    const newPwd = self.newPassword();

                    if (newPwd && value !== newPwd) {
                        self.confirmPassword("");
                        throw new Error(self.nls.placeholder.passwordmatch);
                    }

                    return true;
                }
            };

            passwordPolicygetCall(self.passwordPolicygetname(), self.passwordPolicygetdescription(), self.passwordPolicygettoken(), self.passwordPolicygetroles()).then(function (data) {
                self.passwordPolicygetVar(data);
                self.passwordPolicyLoaded(true);

                if (data && data.passwordPolicyDTO[0]) {
                    self.pwdMinLength = ko.observable(data.passwordPolicyDTO[0].pwdMinLength);
                    self.pwdMaxLength = ko.observable(data.passwordPolicyDTO[0].pwdMaxLength);
                    self.nbrUpperAlpha = ko.observable(data.passwordPolicyDTO[0].nbrUpperAlpha);
                    self.nbrLowerAlpha = ko.observable(data.passwordPolicyDTO[0].nbrLowerAlpha);
                    self.nbrNumeric = ko.observable(data.passwordPolicyDTO[0].nbrNumeric);
                    self.nbrSpecial = ko.observable(data.passwordPolicyDTO[0].nbrSpecial);
                    self.isnbrAllowed = ko.observable(data.passwordPolicyDTO[0].numericAllowed);
                    self.isUpperAllowed = ko.observable(data.passwordPolicyDTO[0].upperAlphaAllowed);
                    self.isLowerAllowed = ko.observable(data.passwordPolicyDTO[0].lowerAlphaAllowed);
                    self.isSpecialCharAllowed = ko.observable(data.passwordPolicyDTO[0].specialCharsAllowed);
                    self.specialAllowed = ko.observableArray(data.passwordPolicyDTO[0].specialCharAllowed);
                    self.successiveChars = ko.observable(data.passwordPolicyDTO[0].successiveAllowed);
                    self.nbrSuccessiveChars = ko.observable(data.passwordPolicyDTO[0].nbrSuccessiveChars);
                    self.nbrRepeativeChars = ko.observable(data.passwordPolicyDTO[0].nbrRepeatChars);
                    self.personalDetExclude = ko.observable(data.passwordPolicyDTO[0].personalDetExclude);
                    self.pwdHistorySize = ko.observable(data.passwordPolicyDTO[0].pwdHistorySize);
                    self.excludedDictWords = ko.observable(data.passwordPolicyDTO[0].excludedDictWords);

                    self.showPasswordRule1(params.baseModel.format(self.nls.changePassword.showPasswordRule1, {
                        pwdMinLength: self.pwdMinLength(),
                        pwdMaxLength: self.pwdMaxLength()
                    }));

                    if (self.isUpperAllowed()) {
                        if (self.nbrUpperAlpha() !== null && self.nbrUpperAlpha() !== 0 && self.nbrUpperAlpha() !== undefined) {
                            self.mandatoryUpper().push(params.baseModel.format(self.nls.changePassword.mandatoryUpper, { nbrUpper: self.nbrUpperAlpha() }));
                        }

                        self.showPasswordRule2(params.baseModel.format(self.nls.changePassword.showPasswordRule2, { mandatoryUpper: self.mandatoryUpper() }));
                    } else {
                        self.showPasswordRule2(params.baseModel.format(self.nls.changePassword.showPasswordRule2, { mandatoryUpper: self.nls.changePassword.notAllowed }));
                    }

                    if (self.isLowerAllowed()) {
                        if (self.nbrLowerAlpha() !== null && self.nbrLowerAlpha() !== 0 && self.nbrLowerAlpha() !== undefined) {
                            self.mandatoryLower(params.baseModel.format(self.nls.changePassword.mandatoryLower, { nbrLower: self.nbrLowerAlpha() }));
                        }

                        self.showPasswordRule3(params.baseModel.format(self.nls.changePassword.showPasswordRule3, { mandatoryLower: self.mandatoryLower() }));
                    } else {
                        self.showPasswordRule3(params.baseModel.format(self.nls.changePassword.showPasswordRule3, { mandatoryLower: self.nls.changePassword.notAllowed }));
                    }

                    if (self.isnbrAllowed()) {
                        if (self.nbrNumeric() !== null && self.nbrNumeric() !== 0 && self.nbrNumeric() !== undefined) {
                            self.mandatoryNumber(params.baseModel.format(self.nls.changePassword.mandatoryNumber, { nbrNumber: self.nbrNumeric() }));
                        }

                        self.showPasswordRule5(params.baseModel.format(self.nls.changePassword.showPasswordRule5, { mandatoryNumber: self.mandatoryNumber() }));
                    } else {
                        self.showPasswordRule5(params.baseModel.format(self.nls.changePassword.showPasswordRule5, { mandatoryNumber: self.nls.changePassword.notAllowed }));
                    }

                    if (self.isSpecialCharAllowed()) {
                        if (self.nbrSpecial() !== null && self.nbrSpecial() !== 0 && self.nbrSpecial() !== undefined) {
                            self.mandatorySpecialChar(params.baseModel.format(self.nls.changePassword.mandatorySpecialChar, { nbrSpecial: self.nbrSpecial() }));
                        }

                        self.specialCharlist(params.baseModel.format(self.nls.changePassword.specialCharlist, { specialCharList: self.specialAllowed() }));

                        self.showPasswordRule7(params.baseModel.format(self.nls.changePassword.showPasswordRule7, {
                            mandatorySpecialChar: self.mandatorySpecialChar(),
                            specialCharlist: self.specialCharlist()
                        }));
                    } else {
                        self.showPasswordRule7(params.baseModel.format(self.nls.changePassword.showPasswordRule7, {
                            mandatorySpecialChar: self.nls.changePassword.notAllowed,
                            specialCharlist: self.specialCharlist()
                        }));
                    }

                    if (self.nbrSuccessiveChars() !== undefined) {
                        self.showPasswordRule4(params.baseModel.format(self.nls.changePassword.showPasswordRule4, { nbrConsecutive: self.nbrSuccessiveChars() }));
                    }

                    if (self.nbrRepeativeChars() !== undefined) {
                        self.showPasswordRule8(params.baseModel.format(self.nls.changePassword.showPasswordRule8, { nbrIdentical: self.nbrRepeativeChars() }));
                    }

                    self.showPasswordRule6(self.nls.changePassword.showPasswordRule6);

                    params.dashboard.helpComponent.params({
                        passwordPolicy: {
                            rule1: self.showPasswordRule1,
                            rule2: self.showPasswordRule2,
                            rule3: self.showPasswordRule3,
                            rule5: self.showPasswordRule5,
                            rule7: self.showPasswordRule7,
                            rule4: self.showPasswordRule4,
                            rule8: self.showPasswordRule8,
                            rule6: self.showPasswordRule6
                        }
                    });

                    self.passwordPolicyLoaded(true);
                }
            });

            self.closeDisclaimer = ko.observable(false);

            params.dashboard.helpComponent.params({
                passwordPolicy: {
                    rule1: self.showPasswordRule1,
                    rule2: self.showPasswordRule2,
                    rule3: self.showPasswordRule3,
                    rule5: self.showPasswordRule5,
                    rule7: self.showPasswordRule7,
                    rule4: self.showPasswordRule4,
                    rule8: self.showPasswordRule8,
                    rule6: self.showPasswordRule6
                }
            });

            self.pwdPolicyChecked = ko.observable(false);

            self.nullCheck = function () {
                if (params.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
                    params.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd());
                }
            };

            self.newPassword.subscribe(function () {
                if (!params.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
                    return;
                }

                if (!params.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd())) {
                    return;
                }

                self.setNewPass(false);
                self.confirmPassword("");
                self.setNewPass(true);
                self.specialCharPresent = ko.observableArray();
                self.policy1violated(false);
                self.policy2violated(false);
                self.policy3violated(false);
                self.policy5violated(false);
                self.policy7violated(false);
                self.policy4violated(false);
                self.policy8violated(false);
                self.policy6violated(false);

                if (self.newPassword() === null || self.newPassword().length < self.pwdMinLength() || self.newPassword().length > self.pwdMaxLength()) {
                    self.policy1violated(true);
                }

                self.checkAlphaCount = function () {
                    let uppercount = 0, lowercount = 0, specialcharcount = 0, numbercount = 0, i;

                    for (i = 0; i < self.newPassword().length; i++) {
                        if (!isNaN(self.newPassword().charAt(i))) {
                            numbercount++;
                        } else if (/^[a-zA-Z0-9- ]*$/.test(self.newPassword().charAt(i)) === false) {
                            specialcharcount++;
                            self.specialCharPresent.push(self.newPassword().charAt(i));

                            for (let j = 0; j < self.specialCharPresent().length; j++) {
                                if (!(self.specialAllowed().filter(function (e) {
                                        return e === self.specialCharPresent()[j];
                                    }).length > 0)) {
                                    self.policy7violated(true);
                                }
                            }
                        } else if (self.newPassword().charAt(i) === self.newPassword().charAt(i).toUpperCase()) {
                            uppercount++;
                        } else if (self.newPassword().charAt(i) === self.newPassword().charAt(i).toLowerCase()) {
                            lowercount++;
                        }
                    }

                    if (!self.isUpperAllowed() && uppercount !== 0) {
                        self.policy2violated(true);
                    } else if (uppercount < self.nbrUpperAlpha()) {
                        self.policy2violated(true);
                    }

                    if (!self.isLowerAllowed() && lowercount !== 0) {
                        self.policy3violated(true);
                    } else if (lowercount < self.nbrLowerAlpha()) {
                        self.policy3violated(true);
                    }

                    if (!self.isnbrAllowed() && numbercount !== 0) {
                        self.policy5violated(true);
                    } else if (numbercount < self.nbrNumeric()) {
                        self.policy5violated(true);
                    }

                    if (!self.isSpecialCharAllowed() && specialcharcount !== 0) {
                        self.policy7violated(true);
                    } else if (specialcharcount < self.nbrSpecial()) {
                        self.policy7violated(true);
                    }
                };

                self.checkAlphaCount();

                self.checkSuccessiveChars = function () {
                    let prevChar, currChar, count = 0, repeat = 0, i;

                    for (i = 1; i < self.newPassword().length; i++) {
                        prevChar = self.newPassword().charCodeAt(i - 1);
                        currChar = self.newPassword().charCodeAt(i);

                        if (currChar - prevChar === 1) {
                            count = count + 1;
                        } else {
                            count = 0;
                        }

                        if (currChar - prevChar === 0) {
                            repeat = repeat + 1;
                        } else {
                            repeat = 0;
                        }

                        if (count === self.nbrSuccessiveChars()) {
                            self.policy4violated(true);
                        }

                        if (count === self.nbrRepeativeChars()) {
                            self.policy8violated(true);
                        }
                    }
                };

                self.checkSuccessiveChars();

                if (self.excludedDictWords()) {
                    ko.utils.arrayForEach(self.excludedDictWords(), function (item) {
                        if (self.newPassword() === item) {
                            self.policy6violated(true);
                        }
                    });
                }

                self.pwdPolicyChecked(true);

                if (self.policy1violated() || self.policy2violated() || self.policy3violated() || self.policy5violated() || self.policy7violated() || self.policy8violated() || self.policy4violated() || self.policy6violated()) {
                    return;
                }

                self.pwdValidated(true);
            });

            return true;
        }

        return {
            walletsregistrationpostCall: walletsregistrationpostCall,
            usersuserIdexistsgetCall: usersuserIdexistsgetCall,
            passwordPolicygetCall: passwordPolicygetCall,
            walletsregistrationregistrationIdcredentialspostCall: walletsregistrationregistrationIdcredentialspostCall,
            onClickSubmit89: onClickSubmit89,
            onClickBack79: onClickBack79,
            init: init
        };
    };
});
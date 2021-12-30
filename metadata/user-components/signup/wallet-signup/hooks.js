define([
    "./model",
    "jquery",
    "knockout"
], function (Model, $, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function walletsregistrationpostCall(payload, config) {
            return Model.walletsregistrationpost(payload, config);
        }

                function enumerationsISDCodegetCall(payload, config) {
            return Model.enumerationsISDCodeget(payload, config);
        }

                function onClickViewTermsConditions15() {
            $("#registrationterms").trigger("openModal");
        }

                function terms38ValueChangeHook(newValue) {
            const enablegetotp = self.otpButton();

            if (newValue[0] === true) {
                self.otpButton(!enablegetotp);
            } else {
                self.otpButton(true);
            }
        }

                function onClickOk64() {
            $("#registrationterms").trigger("closeModal");
        }

                function onClickGetOTP54() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (self.agreement()[0]) {
                walletsregistrationpostCall(ko.toJSON(self.modelInstance.walletsregistrationpostv1payload)).then(function (response) {
                    if (response) {
                        if (response.walletDTO && response.walletDTO.registrationId) {
                            self.modelInstance.walletsregistrationpostv1payload.registrationId = response.walletDTO.registrationId;
                            self.baseUrl("registration/" + response.walletDTO.registrationId);
                            self.allEnumLoaded(false);
                            self.verification(true);
                        }
                    }
                });
            }
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function () {
                return true;
            };

            self.allDetails = rootParams.rootModel.params.allDetails;
            self.agreement = ko.observableArray();
            self.otpButton = ko.observable(true);
            self.mobileplaceholder = ko.observable(self.nls.mobileplaceholder);
            self.verification = ko.observable(false);
            self.allEnumLoaded = ko.observable(false);
            self.countryEnumLoaded = ko.observable(false);
            self.baseUrl = ko.observable();
            params.baseModel.registerComponent("otp-verification", "base-components");
            params.baseModel.registerComponent("wallet-profile-detail", "signup");
            self.emailDispatched = ko.observable(false);

            self.OtpAuthentication = function (data) {
                if (data.tokenValid) {
                    self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
                    params.dashboard.loadComponent("wallet-profile-detail", { allDetails: self.allDetails });
                }
            };

            enumerationsISDCodegetCall().then(function (response) {
                self.enumerationsISDCodegetVar(response.enumRepresentations[0].data);
                self.countryEnumLoaded(true);
                self.allEnumLoaded(true);

                if (self.allDetails) {
                    self.modelInstance.walletsregistrationpostv1payload = self.allDetails;
                }
            });

            return true;
        }

        return {
            walletsregistrationpostCall: walletsregistrationpostCall,
            enumerationsISDCodegetCall: enumerationsISDCodegetCall,
            onClickViewTermsConditions15: onClickViewTermsConditions15,
            terms38ValueChangeHook: terms38ValueChangeHook,
            onClickOk64: onClickOk64,
            onClickGetOTP54: onClickGetOTP54,
            init: init
        };
    };
});
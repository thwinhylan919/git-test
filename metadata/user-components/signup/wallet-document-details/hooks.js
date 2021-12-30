define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function enumerationsidentificationTypegetCall(productSubClass, payload, config) {
            return Model.enumerationsidentificationTypeget(productSubClass, payload, config);
        }

                function walletsregistrationpostCall(payload, config) {
            return Model.walletsregistrationpost(payload, config);
        }

                function IdentityVerification42ValueChangeHook() {
            if (self.fisrttimeloaded()) {
                self.fisrttimeloaded(false);
            } else {
                self.modelInstance.walletsregistrationpostv1payload.identificationDTO.identificationValue = "";
            }
        }

                function verification100ValueChangeHook(newValue) {
            const enableNext = self.nextButton();

            if (newValue[0] === true) {
                self.nextButton(!enableNext);
            } else {
                self.nextButton(true);
            }
        }

                function onClickNext81() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
            params.dashboard.loadComponent("wallet-address-details", { allDetails: self.allDetails });
        }

                function onClickBack40() {
            self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
            params.dashboard.loadComponent("wallet-profile-detail", { allDetails: self.allDetails });
        }

                function onClickSkip9() {
            self.modelInstance.walletsregistrationpostv1payload.identificationDTO.identificationValue = "";
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
            self.allEnumloaded = ko.observable(false);
            self.fisrttimeloaded = ko.observable(false);
            self.identityenumloaded = ko.observable(false);
            self.nextButton = ko.observable(true);
            self.verificationcheck = ko.observableArray();
            self.identity = ko.observable(false);
            params.baseModel.registerComponent("wallet-address-details", "signup");
            params.baseModel.registerComponent("wallet-profile-detail", "signup");

            enumerationsidentificationTypegetCall(self.enumerationsidentificationTypegetproductSubClass()).then(function (response) {
                self.enumerationsidentificationTypegetVar(response.enumRepresentations[0].data);
                self.allEnumloaded(true);
                self.identityenumloaded(true);
                self.fisrttimeloaded(true);

                if (self.allDetails) {
                    self.modelInstance.walletsregistrationpostv1payload = self.allDetails;
                }
            });

            return true;
        }

        return {
            enumerationsidentificationTypegetCall: enumerationsidentificationTypegetCall,
            walletsregistrationpostCall: walletsregistrationpostCall,
            IdentityVerification42ValueChangeHook: IdentityVerification42ValueChangeHook,
            verification100ValueChangeHook: verification100ValueChangeHook,
            onClickNext81: onClickNext81,
            onClickBack40: onClickBack40,
            onClickSkip9: onClickSkip9,
            init: init
        };
    };
});
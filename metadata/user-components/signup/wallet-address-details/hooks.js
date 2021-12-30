define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function enumerationscountrygetCall(payload, config) {
            return Model.enumerationscountryget(payload, config);
        }

                function walletsregistrationpostCall(payload, config) {
            return Model.walletsregistrationpost(payload, config);
        }

                function onClickNext65() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
            params.dashboard.loadComponent("wallet-setup-credentials", { allDetails: self.allDetails });
        }

                function onClickBack56() {
            self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
            params.dashboard.loadComponent("wallet-document-details", { allDetails: self.allDetails });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.allDetails = params.rootModel.params.allDetails;
            self.allEnumloaded = ko.observable(false);
            self.countryLoaded = ko.observable(false);

            self.pageRendered = function () {
                return true;
            };

            params.baseModel.registerComponent("wallet-setup-credentials", "signup");
            params.baseModel.registerComponent("wallet-document-details", "signup");

            enumerationscountrygetCall().then(function (response) {
                self.enumerationscountrygetVar(response.enumRepresentations[0].data);
                self.allEnumloaded(true);
                self.countryLoaded(true);

                if (self.allDetails) {
                    self.modelInstance.walletsregistrationpostv1payload = self.allDetails;
                }
            });

            return true;
        }

        return {
            enumerationscountrygetCall: enumerationscountrygetCall,
            walletsregistrationpostCall: walletsregistrationpostCall,
            onClickNext65: onClickNext65,
            onClickBack56: onClickBack56,
            init: init
        };
    };
});
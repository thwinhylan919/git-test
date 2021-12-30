define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function enumerationsgendergetCall(payload, config) {
            return Model.enumerationsgenderget(payload, config);
        }

                function walletsregistrationpostCall(payload, config) {
            return Model.walletsregistrationpost(payload, config);
        }

                function onClickNext11() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (self.allDetails) {
                self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
            }

            params.dashboard.loadComponent("wallet-document-details", { allDetails: self.allDetails });
        }

                function onClickBack68() {
            if (self.allDetails) {
                self.allDetails = self.modelInstance.walletsregistrationpostv1payload;
            }

            params.dashboard.loadComponent("wallet-signup", { allDetails: self.allDetails });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function () {
                return true;
            };

            self.allDetails = params.rootModel.params.allDetails;
            self.allEnumloaded = ko.observable(false);
            self.genderenumloaded = ko.observable(false);
            self.gendertype = ko.observable("");
            self.clickedMale = ko.observable(false);
            self.middlename = "";
            self.clickedFemale = ko.observable(false);
            self.clickedOther = ko.observable(false);
            self.clickednotprefer = ko.observable(false);
            params.baseModel.registerComponent("wallet-document-details", "signup");
            params.baseModel.registerComponent("wallet-signup", "signup");

            enumerationsgendergetCall().then(function (response) {
                self.enumerationsgendergetVar(response.enumRepresentations[0].data);
                self.allEnumloaded(true);
                self.genderenumloaded(true);

                if (self.allDetails) {
                    self.modelInstance.walletsregistrationpostv1payload = self.allDetails;
                }
            });

            return true;
        }

        return {
            enumerationsgendergetCall: enumerationsgendergetCall,
            walletsregistrationpostCall: walletsregistrationpostCall,
            onClickNext11: onClickNext11,
            onClickBack68: onClickBack68,
            init: init
        };
    };
});
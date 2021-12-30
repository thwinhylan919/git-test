define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function enumerationscountrygetCall() {
            return Model.enumerationscountryget();
        }

                function Isthiscollateralalreadycharged13ValueChangeHook(newValue) {
            if (newValue === "true") {
                self.seniorityDetails.push(self.bankDetails());
                self.bankCountOfChargedCollateral("one");
            } else {
                self.seniorityDetails.removeAll();
            }
        }

                function WithhowmanyBanksthiscollateralisalreadycharged75ValueChangeHook(newValue) {
            self.seniorityDetailsLoaded(false);

            if (newValue === "two") {
                self.seniorityDetails.push(self.bankDetails());
            } else if (newValue === "one") {
                self.seniorityDetails.splice(1, 1);
            }

            ko.tasks.runEarly();
            self.seniorityDetailsLoaded(true);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.review = params.review;
            self.seniorityTracker = ko.observable();
            self.seniorityDetails = ko.observableArray([]);
            self.seniorityDetailsLoaded = ko.observable(true);
            self.countryList = ko.observableArray([]);
            self.countryListDescription = {};

            self.bankDetails = function () {
                return {
                    bankName: ko.observable(),
                    percentagePledged: ko.observable(),
                    pointOfContact: ko.observable(),
                    branchName: ko.observable(),
                    branchAddress: {
                        line1: ko.observable(),
                        line2: ko.observable(),
                        city: ko.observable(),
                        state: ko.observable(),
                        country: ko.observable(),
                        zipCode: ko.observable()
                    },
                    branchEmail: ko.observable(),
                    branchContactNumber: ko.observable()
                };
            };

            self.seniorityDetails.push(self.bankDetails());

            if (params.payload && params.payload.seniorityDetails) {
                ko.utils.extend(self.seniorityDetails()[0], params.payload.seniorityDetails()[0]);
            }

            ko.utils.extend(params.payload, { seniorityDetails: self.seniorityDetails });
            self.isCollateralCharged = ko.observable(self.seniorityDetails() && self.seniorityDetails().length ? "true" : "false");
            self.bankCountOfChargedCollateral = ko.observable(self.seniorityDetails() ? self.seniorityDetails().length === 2 ? "two" : "one" : null);

            if (params.review) {
                params.dashboard.headerName(self.nls.collaterEvaluationHeader);
            }

            let errorMessages = [];

            function functionalValidations(sharePercentage) {
                let validationFlag = true;

                errorMessages = [];

                if (sharePercentage.toFixed(2) > 99.99) {
                    errorMessages.push(self.nls.errorMessages.incorrectPercentagesCombination);
                    validationFlag = false;
                }

                return validationFlag;
            }

            params.rootModel.successHandler = function () {
                return new Promise(function (resolve) {
                    if (rootParams.baseModel.showComponentValidationErrors(document.getElementById("seniorityTracker"))) {
                        let sharePercentage = 0;

                        ko.utils.arrayForEach(self.seniorityDetails(), function (item) {
                            sharePercentage += item.percentagePledged();
                        });

                        if (!functionalValidations(sharePercentage)) {
                            rootParams.baseModel.showMessages(null, errorMessages, "ERROR");

                            return false;
                        }

                        resolve();
                    }
                });
            };

            enumerationscountrygetCall().then(function (response) {
                self.countryList(response.enumRepresentations[0].data);

                ko.utils.arrayForEach(response.enumRepresentations[0].data, function (item) {
                    self.countryListDescription[item.code] = item.description;
                });
            });

            return true;
        }

        return {
            enumerationscountrygetCall: enumerationscountrygetCall,
            Isthiscollateralalreadycharged13ValueChangeHook: Isthiscollateralalreadycharged13ValueChangeHook,
            WithhowmanyBanksthiscollateralisalreadycharged75ValueChangeHook: WithhowmanyBanksthiscollateralisalreadycharged75ValueChangeHook,
            init: init
        };
    };
});
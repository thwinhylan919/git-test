define(["knockout"], function (ko) {
    "use strict";

    return function () {
        let self,
         params;

                function onClickRemoveOwner22(data) {
            self.sharedDetails.splice(data.index, 1);
        }

                function onClickAddOwner1() {
            self.sharedDetails.push(self.loadOwnershipDetails());
        }

        function init(bindingContext, rootParams) {
            params = rootParams;
            self = bindingContext;
            self.review = params.review;

            self.loadOwnershipDetails = function () {
                return {
                    partyName: ko.observable(),
                    sharePercentage: ko.observable(),
                    primaryParty: ko.observable(),
                    partyId: ko.observable()
                };
            };

            self.sharedDetails = ko.observableArray([]);
            self.sharedDetails.push(self.loadOwnershipDetails());

            if (params.payload && params.payload.sharedDetails) {
                ko.utils.extend(self.sharedDetails()[0], params.payload.sharedDetails()[0]);
            }

            ko.utils.extend(params.payload, { sharedDetails: self.sharedDetails });

            if (params.review) {
                params.dashboard.headerName(self.nls.collaterEvaluationHeader);
            }

            let errorMessages = [];

            function functionalValidations(isPrimaryOwnerCount, sharePercentage) {
                let validationFlag = true;

                errorMessages = [];

                if (isPrimaryOwnerCount > 1) {
                    errorMessages.push(self.nls.errorMessages.multiplePrimaryOwnerErrorMessage);
                    validationFlag = false;
                } else if (!isPrimaryOwnerCount) {
                    errorMessages.push(self.nls.errorMessages.noPrimaryOwnerErrorMessage);
                    validationFlag = false;
                }

                if (sharePercentage !== 100) {
                    errorMessages.push(self.nls.errorMessages.incorrectPercentagesCombination);
                    validationFlag = false;
                }

                return validationFlag;
            }

            params.rootModel.successHandler = function () {
                return new Promise(function (resolve) {
                    if (params.baseModel.showComponentValidationErrors(document.getElementById("ownershipDetailsTracker"))) {
                        let isPrimaryOwnerCount = 0, sharePercentage = 0;

                        ko.utils.arrayForEach(self.sharedDetails(), function (item) {
                            sharePercentage += item.sharePercentage();

                            if (item.primaryParty()) {
                                isPrimaryOwnerCount++;
                            }
                        });

                        if (!functionalValidations(isPrimaryOwnerCount, sharePercentage)) {
                            rootParams.baseModel.showMessages(null, errorMessages, "ERROR");

                            return false;
                        }

                        resolve();
                    }
                });
            };

            return true;
        }

        return {
            onClickRemoveOwner22: onClickRemoveOwner22,
            onClickAddOwner1: onClickAddOwner1,
            init: init
        };
    };
});
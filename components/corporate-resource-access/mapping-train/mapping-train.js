define([
    "ojL10n!resources/nls/mapping-train",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtrain"
], function (resourceBundle, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.nextPressed = params.nextPressed;

        self.selectedStepValue = params.selectedStepValue ? params.selectedStepValue : ko.observable("attribute-details");
        self.selectedStepLabel = params.selectedStepLabel ? params.selectedStepLabel : ko.observable(params.baseModel.format(self.nls.resourceMap,{attributeName : params.attributeName}));
        self.stepArray = params.stepArray;

        self.updateLabelText = function (event) {
            if (event) {
                const train = document.getElementById("train72");

                self.selectedStepLabel(train.getStep(event.detail.value).label);

                self.selectedStepValue(event.detail.value);

                if (event.detail.value === "transaction-details") {
                    self.stepArray()[0].visited = false;
                    self.stepArray()[0].disabled = !!params.editPressed();
                    self.nextPressed(true);
                } else if (event.detail.value === "attribute-details") {
                    self.stepArray()[1].visited = false;
                    self.stepArray()[1].disabled = !!params.editPressed();
                    self.nextPressed(false);
                    params.dashboard.hideDetails();
                }

            }

        };
    };
});
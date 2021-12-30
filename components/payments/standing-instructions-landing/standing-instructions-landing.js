define([
    "knockout",
    "ojL10n!resources/nls/standing-instructions-landing",
    "ojs/ojradioset",
    "ojs/ojknockout"
], function(ko, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        self.selectedOption = ko.observable();
        ko.utils.extend(self, Params.rootModel.previousState && Params.rootModel.previousState.retainedData ? Params.rootModel.previousState.retainedData : Params.rootModel);
        self.resource = ResourceBundle;
        Params.baseModel.registerComponent("standing-instructions-list", "payments");
        Params.baseModel.registerComponent("payments-money-transfer", "payments");
        self.dispose = null;

        self.SIoptionsArray = [{
                id: "standing-instructions-list",
                label: self.resource.labels.silist
            },
            {
                id: "payments-money-transfer",
                label: self.resource.labels.sicreate
            }
        ];

        if (!self.selectedOption()) {
            self.selectedOption(self.params && self.params.component? self.params.component : "standing-instructions-list");
        }

    };
});
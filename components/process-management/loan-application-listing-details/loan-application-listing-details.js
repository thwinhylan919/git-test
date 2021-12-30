define([
    "ojL10n!resources/nls/loan-application-listing-details",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojbutton"
], function (resourceBundle, ko) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.componentHeader);
        rootParams.baseModel.registerElement("help");
        self.showHeaderStrip = ko.observable(true);
        self.cardData = ko.observable(rootParams.rootModel.params.data.cardItem);
        self.selectedParty = ko.observable(rootParams.rootModel.params.data.selectedParty());
        self.parameters = rootParams.rootModel.params;

        self.goBack = function () {
            rootParams.dashboard.loadComponent("loan-application-listing");
        };

        self.onClickApplicationsDetails = function () {
            if (self.cardData().type === "Loan Drawdown") {
                rootParams.baseModel.registerElement("flow");

                rootParams.dashboard.loadComponent("flow", {
                        flowName: "loan-drawdown",
                        flowStageRootModel: {
                            data: ko.mapping.toJS(self.parameters.payload),
                            fromTracker : true
                            },
                            flowMode: "readonly"
                        });
         }

    else {
    rootParams.baseModel.registerComponent("loan-application-listing-details-review", "process-management");
    rootParams.dashboard.loadComponent("loan-application-listing-details-review", self.parameters);
}
        };

        self.onCloseCancelStrip = function () {
            self.showHeaderStrip(false);
        };

    };
});

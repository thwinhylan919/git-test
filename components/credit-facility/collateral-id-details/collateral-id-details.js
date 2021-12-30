define([
    "knockout",
    "ojL10n!resources/nls/collateral-overview",
    "ojs/ojbutton",
    "ojs/ojnavigationlist",
    "ojs/ojvalidationgroup",
    "ojs/ojformlayout"
], function(ko, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        self.nav = ko.observableArray();
        ko.utils.extend(self, params.rootModel);
        self.catedata = ko.observable(params.rootModel.collateralData().collateralDTO.collateralDetails);
        self.collateralId = ko.observable(params.rootModel.collateralData().collateralDTO.collateralCode);
        params.baseModel.registerElement(["nav-bar", "flow"]);
        params.baseModel.registerComponent("collateral-overview", "credit-facility");

        self.loadRevaluate = function() {
            params.dashboard.loadComponent("flow", {
                flowName: "collateral-revaluation-flow",
                flowStageRootModel: {
                    collateralId: self.collateralId()
                },
                flowStartIndex: 0
            });
        };

        self.currency = ko.observable(params.rootModel.collateralData().collateralDTO.availableAmount.currency);
        self.collateralPropValueArray = ko.observableArray();
        self.hyphen = "-";

        let element;

        for (element in self.catedata()) {

            if (element !== "version" && element !== "generatedPackageId" && element !== "auditSequence") {
                self.collateralPropValueArray.push({
                    label: element,
                    value: self.catedata()[element]
                });
            }

        }

        self.back = function() {
            history.back();
            params.dashboard.loadComponent("collateral-overview", {});
        };
    };
});
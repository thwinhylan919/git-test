define([
    "knockout",
    "ojL10n!resources/nls/collateral-overview",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojslider",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojrowexpander",
    "ojs/ojflattenedtreetabledatasource",
    "ojs/ojtreeview",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojmenu",
    "ojs/ojcube",
    "ojs/ojdatagrid",
    "ojs/ojoption",
    "ojs/ojarraydataprovider",
    "ojs/ojlistview",
    "ojs/ojprogress",
    "ojs/ojformlayout"
], function (ko, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        self.locale = resourceBundle;
        ko.utils.extend(self, params.rootModel);
        self.groupID = ko.observable();
        self.blank = ko.observable("-");
        self.collateralID = ko.observable();
        self.selected = ko.observable();
        params.baseModel.registerComponent("facility-overview", "credit-facility");
        self.resources = resourceBundle.structure.labels;
        self.generic = resourceBundle.structure.generic;
        self.poolpercentageValue=ko.observable();
        self.poolAmount=ko.observable();

        self.progressValue = function (data) {

            return Math.round(data.collateralData().collateralGroupDTO.groupAmount.amount*(data.facilityData().facilityDTO.collateralPool[0].poolPercentage/100));
        };

        self.back = function () {
            history.back();
            params.dashboard.loadComponent("facility-overview", {});
        };

        self.showCollaterals = function (data) {
            if (self.selected() === data.poolId) {
                self.selected("");
            } else {
                self.selected(data.poolId);
            }

        };
    };
});
define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/collateral-overview",
    "ojs/ojbutton",
    "ojs/ojnavigationlist","ojs/ojformlayout","ojs/ojlistview","ojs/ojtreeview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojflattenedtreetabledatasource",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojarraydataprovider"
], function (ko,resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        self.locale = resourceBundle;
        ko.utils.extend(self, params.rootModel);
        self.FinancialChargesCoverage = ko.observable();
        self.facilityDataLoaded = ko.observable(false);
        self.count=ko.observable();
        self.utiCurrency = ko.observable("INR");
        self.utiAmount = ko.observable("30000");
        params.baseModel.registerComponent("facility-overview", "credit-facility");
        self.date = ko.observable("2019-03-01T00:00:00");

        self.back = function () {
            history.back();
            params.dashboard.loadComponent("facility-overview", {});
        };
    };
});

define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/details",
    "ojs/ojbutton",
    "ojs/ojnavigationlist", "ojs/ojvalidationgroup", "ojs/ojformlayout"
], function (oj,ko, resourceBundle) {
    "use strict";

    return function (rootparams) {
        const self = this;

        ko.utils.extend(self, rootparams.rootModel);
        self.nls = resourceBundle;
        self.nav = ko.observableArray();
        self.blank = ko.observable("-");

        rootparams.baseModel.registerElement("segment-container");
        rootparams.baseModel.registerComponent("facility-overview", "credit-facility");

        self.currentDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(rootparams.baseModel.getDate())));

        rootparams.baseModel.registerElement("nav-bar");

        self.back = function () {
            history.back();
            rootparams.dashboard.loadComponent("facility-overview", {});
        };

        self.amendFacility = function () {
            const parameters = {
                productId: "facilityAmend",
                dataSegments: [ "fsgbu-ob-clmo-ds-facility-application","fsgbu-ob-clmo-ds-collaterals","fsgbu-ob-clmo-ds-upload-documents"],
                data:self.facilityData().facilityDTO
              };

            rootparams.dashboard.loadComponent("segment-container", parameters);
        };

        self.createSubFacility = function () {
            const parameters = {
                productId: "facilityAmend",
                dataSegments: [ "fsgbu-ob-clmo-ds-facility-application","fsgbu-ob-clmo-ds-collaterals","fsgbu-ob-clmo-ds-upload-documents"],
                data:self.facilityData().facilityDTO
              };

            rootparams.dashboard.loadComponent("segment-container", parameters);
        };
    };
});

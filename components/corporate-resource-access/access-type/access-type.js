define([
    "ojL10n!resources/nls/access-type",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function (resourceBundle, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.futureAttributeAccess = params.futureAttributeAccess;
        self.disabled = params.disabled;
        self.attributeName = params.attributeName;
        self.toolTopDisplayMsg = ko.observable();

        if (params.attributeName === "Program") {
            self.toolTopDisplayMsg(self.nls.tooltip.autoManualMessageProgmams);
        } else if (params.attributeName === "Facility") {
            self.toolTopDisplayMsg(self.nls.tooltip.autoManualMessageFacilities);
        } else if (params.attributeName === "Remitter List") {
            self.toolTopDisplayMsg(self.nls.tooltip.autoManualMessageRemitterLists);
        }
    };
});
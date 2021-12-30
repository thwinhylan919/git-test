define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/reports",
    "ojs/ojnavigationlist",
    "ojs/ojradioset"
], function (ko, $, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle.reportsDetails;
        rootParams.baseModel.registerElement(["nav-bar", "modal-window"]);
        rootParams.baseModel.registerComponent("report-user-search", "reports");
        rootParams.dashboard.headerName(self.nls.labels.title);
        self.reportType = ko.observable();
        self.isAdmin = ko.observable(false);

        self.showModal = function () {
            $("#choicePopup").trigger("openModal");
        };

        self.closeHandler = function () {
            rootParams.dashboard.switchModule();
        };

        self.reportTypeSelected = function () {
            if (self.reportType() === "AdminUser") {
                self.isAdmin(true);
            } else if (self.reportType() === "CorporateUser") {
                self.isAdmin(false);
            }

            const params = {
                isAdmin: self.isAdmin()
            };

            rootParams.dashboard.loadComponent("report-user-search", params);
        };
    };
});
define([
    "knockout",
    "ojL10n!resources/nls/admin-activity",
    "load!./admin-activities.json",
    "load!./corporate-admin-activities.json",
    "ojs/ojinputtext",
    "ojs/ojpopup"
], function (ko, resourceBundle, AdminOptions, CorpAdminOptions) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("action-widget");
        self.details = ko.observableArray();

        self.details((rootParams.dashboard.appData.segment === "ADMIN" ? AdminOptions : CorpAdminOptions).module.filter(function (element) {
            element.transactionDetails = rootParams.baseModel.isDashboardBuilderContext() ? element.transactionDetails : rootParams.baseModel.filterAuthorisedComponents(element.transactionDetails, "component");

            if (element.transactionDetails && element.transactionDetails.length) {
                return true;
            }

            return false;
        }));

        self.loadPage = function (data) {
            if (data.class === "transaction") {
                rootParams.baseModel.registerTransaction(data.component, data.module);
            } else {
                rootParams.baseModel.registerComponent(data.component, data.module);
            }

            rootParams.dashboard.loadComponent(data.component, {
                type: data.type
            });
        };
    };
});
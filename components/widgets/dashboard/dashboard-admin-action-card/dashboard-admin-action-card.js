define([
    "ojL10n!resources/nls/dashboard-admin-action-card",
    "load!./dashboard-admin-action-card.json"
], function(resourceBundle, AdminActionCardJSON) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.resource = resourceBundle;

        self.cardData = {
            type: rootParams.data.data.type,
            submenus: rootParams.baseModel.isDashboardBuilderContext() ? AdminActionCardJSON[rootParams.data.data.type] : rootParams.baseModel.filterAuthorisedComponents(AdminActionCardJSON[rootParams.data.data.type], "name")
        };

        self.onCardClick = function(id, module) {
            rootParams.baseModel.registerComponent(id, module);
            rootParams.dashboard.loadComponent(id);
        };
    };
});
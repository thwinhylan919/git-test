define([
    "knockout",
    "ojL10n!resources/nls/quick-links",
    "load!./quick-links.json"
], function(ko, locale, JSONData) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.quickLinkResourceBundle = locale;

        let i, l;
        const quickLinksType = rootParams.type || rootParams.data.data.type;

        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("action-widget");
        self.modulesLoaded = ko.observable(false);
        self.quickLinks = ko.observableArray();

        const valueAssigner = function(data) {
            for (let l = data.length, i = l; i--;) {
                data[i].description = self.quickLinkResourceBundle.quickLinks[data[i].name.split(".")[0]][data[i].name.split(".")[1]];
            }

            return data;
        };

        function setData(data) {
            let components = data[quickLinksType] || data.default;

            if (rootParams.dashboard.appData.segment !== "ADMIN") {
                components = rootParams.baseModel.isDashboardBuilderContext() ? components : rootParams.baseModel.filterAuthorisedComponents(components, "id");
            }

            for (l = components.length, i = l; i--;) {
                if (components[i].class === "transaction") {
                    rootParams.baseModel.registerTransaction(components[i].id, components[i].module);
                } else {
                    rootParams.baseModel.registerComponent(components[i].id, components[i].module);
                }
            }

            const localArray = valueAssigner(components);

            self.quickLinks.removeAll();
            ko.utils.arrayPushAll(self.quickLinks, localArray);
            self.modulesLoaded(true);
        }

        setData(JSONData);

        self.callShowDetails = function(data, action) {
            let parameters;

            if (rootParams.rootModel && rootParams.rootModel.additionalDetails && rootParams.rootModel.additionalDetails()) {
                parameters = rootParams.rootModel.additionalDetails().account;
            } else if (action) {
                parameters = action;
            } else {
                parameters = {
                    type: data.type
                };
            }

            if (data.componentType === "flow") {
                rootParams.dashboard.loadComponent("flow", {
                    flowName: data.id
                });
            } else {
                rootParams.dashboard.loadComponent(data.id, parameters);
            }
        };
    };
});
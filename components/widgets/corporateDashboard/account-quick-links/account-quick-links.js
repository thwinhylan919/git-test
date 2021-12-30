define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/quick-links",
    "load!./accountQuickLinks.json"
], function(ko, QuickLinksModel, locale, JSONData) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.quickLinkResourceBundle = locale;

        let i, l;
        const quickLinksType = rootParams.type;

        rootParams.baseModel.registerElement([
            "account-input",
            "action-widget"
        ]);

        self.quickLinks = ko.observableArray();

        self.valueAssigner = function(data) {
            for (let l = data.length, i = l; i--;) {
                data[i].description = self.quickLinkResourceBundle.quickLinks[data[i].name.split(".")[0]][data[i].name.split(".")[1]];
            }

            return data;
        };

        function setData(data) {
            const components = data[quickLinksType] || data.default;

            for (l = components.length, i = l; i--;) {
                rootParams.baseModel.registerComponent(components[i].id, components[i].module);
            }

            const localArray = self.valueAssigner(components);

            self.quickLinks.removeAll();
            ko.utils.arrayPushAll(self.quickLinks, localArray);
        }

        setData(JSONData);

        self.callShowDetails = function(data, action) {
            if (self.additionalDetails && self.additionalDetails() && data.taskCode) {
                QuickLinksModel.validateAccess(self.additionalDetails().account.id.value, data.taskCode).then(function() {
                    rootParams.dashboard.loadComponent(data.id, self.additionalDetails() ? self.additionalDetails().account : action);
                });
            } else {
                let parameters;

                if (self.additionalDetails && self.additionalDetails()) {
                    parameters = self.additionalDetails().account;
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
            }
        };
    };
});
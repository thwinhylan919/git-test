define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/trade-finance-links"
], function(ko, TradeFinanceLinksModel, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.tradeFinanceLinksResourceBundle = locale;

        let i, l;
        const tradeFinanceLinksType = rootParams.type;

        rootParams.baseModel.registerElement([
            "account-input",
            "action-widget"
        ]);

        self.modulesLoaded = ko.observable(false);
        self.tradeFinanceLinks = ko.observableArray();

        self.valueAssigner = function(data) {
            for (let l = data.length, i = l; i--;) {
                data[i].description = self.tradeFinanceLinksResourceBundle.tradeFinanceLinks[data[i].name.split(".")[0]][data[i].name.split(".")[1]];
            }

            return data;
        };

        TradeFinanceLinksModel.getJSONData().then(function(data) {
            const components = data[tradeFinanceLinksType] || data.default;

            for (l = components.length, i = l; i--;) {
                rootParams.baseModel.registerComponent(components[i].id, components[i].module);
            }

            const localArray = self.valueAssigner(components);

            self.tradeFinanceLinks.removeAll();
            ko.utils.arrayPushAll(self.tradeFinanceLinks, localArray);
            self.modulesLoaded(true);
        });

        self.callShowDetails = function(data, action) {
            if (self.additionalDetails && self.additionalDetails() && data.taskCode) {
                TradeFinanceLinksModel.validateAccess(self.additionalDetails().account.id.value, data.taskCode).then(function() {
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

                rootParams.dashboard.loadComponent(data.id, parameters);
            }
        };
    };
});
define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/help"
], function (oj, ko, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.transaction = null;
        self.loaded = ko.observable();

        let subscriber = null;

        const langPrefix = oj.Config.getLocale() === "en" ? "" : oj.Config.getLocale() + "/";

        if (!rootParams.baseModel.large()) {
            subscriber = rootParams.transaction.subscribe(function (value) {
                self.loaded(false);
                rootParams.dashboard.isHelpAvailable(false);
                ko.tasks.runEarly();

                if (value) {
                    self.transaction = langPrefix + value;
                    self.loaded(true);
                }
            });
        } else {
            self.transaction = langPrefix + ko.utils.unwrapObservable(rootParams.transaction);
            self.loaded(true);
        }

        self.afterRender = function (dashboard, nodeArray) {
            if (dashboard.isHelpAvailable && nodeArray.length) {
                dashboard.isHelpAvailable(true);
            }
        };

        self.dispose = function () {
            if (subscriber) {
                subscriber.dispose();
            }
        };
    };
});
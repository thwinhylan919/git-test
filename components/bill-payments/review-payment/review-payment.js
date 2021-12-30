define([
    "knockout",
    "ojL10n!resources/nls/manage-bill-payments",
    "ojs/ojbutton",
    "ojs/ojknockout"
], function(ko, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        self.mode = ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        params.baseModel.registerComponent("review-bill-payment", "bill-payments");
        params.baseModel.registerComponent("review-quick-recharge", "bill-payments");
        params.baseModel.registerComponent("review-quick-bill-payment", "bill-payments");
    };
});
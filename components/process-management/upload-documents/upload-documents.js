define([
    "knockout"
], function(ko) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params);

        params.baseModel.registerComponent("collateral-evaluation-documents-upload", "credit-facility");
    };
});
define([
    "ojL10n!resources/nls/link-account"
], function(resourceBundle) {
    "use strict";

    /** View description.
     *
     * @param {Object} params  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.

     */
    return function(params) {
        const self = this;

        self.resource = resourceBundle;
        params.baseModel.registerComponent("aggregate-accounts-list", "account-aggregation");

        self.linkAccount = function() {
            params.dashboard.loadComponent("aggregate-accounts-list", {}, self);
        };

    };
});
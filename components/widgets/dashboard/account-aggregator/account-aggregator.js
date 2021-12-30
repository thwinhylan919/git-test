define([
    "ojL10n!resources/nls/account-aggregator"
], function(resourceBundle) {
    "use strict";

    /**
     * Return function - description.
     *
     * @param  {type} params - Description.
     * @return {type}            Description.
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
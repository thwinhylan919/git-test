define([
    "ojL10n!resources/nls/wallet"
], function (resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("product-header-text", "widgets/pre-login");
        rootParams.baseModel.registerComponent("wallet-signup", "signup");

        self.signuppage = function () {
            rootParams.dashboard.loadComponent("wallet-signup", {});
        };
    };
});
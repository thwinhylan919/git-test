define([
    "ojL10n!resources/nls/banking"
], function(resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.resource = resourceBundle;
        rootParams.baseModel.registerComponent("product-header-text", "widgets/pre-login");
    };
});
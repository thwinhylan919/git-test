define(["text!./notional-account-details.html",
    "./notional-account-details",
    "text!./notional-account-details.json"
], function(template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});
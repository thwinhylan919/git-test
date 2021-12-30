define([
        "text!./liquidity-management-approval.html",
        "./liquidity-management-approval",
        "text!./liquidity-management-approval.json"
    ],
    function(template, viewModel) {
        "use strict";

        return {
            viewModel: viewModel,
            template: template
        };
    });
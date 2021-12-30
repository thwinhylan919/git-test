define([
    "text!./init.html",
    "./init",
    "text!./review.html",
    "./review"
], function (transactionInitTemplate, transactionInitViewModel, transactionReviewTemplate, transactionReviewViewModel) {
    "use strict";

    return function (config) {
        if (config.type === "init") {
            return {
                viewModel: transactionInitViewModel,
                template: transactionInitTemplate
            };
        }

        return {
            viewModel: transactionReviewViewModel,
            template: transactionReviewTemplate
        };
    };
});
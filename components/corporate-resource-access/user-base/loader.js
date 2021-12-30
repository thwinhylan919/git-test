define([
        "text!./user-base.html",
        "./user-base",
        "text!./review.html",
        "./review"
    ],
    function (initTemplate, initViewModel, reviewTemplate, reviewViewModel) {
        "use strict";

        return function (config) {
            if (config.type === "init") {
                return {
                    viewModel: initViewModel,
                    template: initTemplate
                };
            }

            return {
                viewModel: reviewViewModel,
                template: reviewTemplate
            };
        };
    });
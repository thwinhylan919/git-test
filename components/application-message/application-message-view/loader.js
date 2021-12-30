define([
    "text!./application-message-view.html",
    "./application-message-view"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});
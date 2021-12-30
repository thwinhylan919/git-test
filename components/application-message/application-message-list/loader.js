define([
    "text!./application-message-list.html",
    "./application-message-list"
], function (template, viewModel) {
    "use strict";

    return {
        viewModel: viewModel,
        template: template
    };
});
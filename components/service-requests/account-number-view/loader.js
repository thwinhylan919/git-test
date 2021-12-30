  define(["text!./account-number-view.html", "./account-number-view", "text!./account-number-view.json"], function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
  define(["text!./gender-view.html", "./gender-view", "text!./gender-view.json"], function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
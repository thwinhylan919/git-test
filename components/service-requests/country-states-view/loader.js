  define(["text!./country-states-view.html", "./country-states-view", "text!./country-states-view.json"], function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
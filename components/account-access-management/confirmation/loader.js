define(["text!./confirmation.html", "./confirmation", "text!./confirmation.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
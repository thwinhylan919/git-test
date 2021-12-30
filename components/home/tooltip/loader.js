define(["text!./tooltip.html", "./tooltip", "text!./tooltip.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
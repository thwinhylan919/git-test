define(["text!./block-card.html", "./block-card", "text!./block-card.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
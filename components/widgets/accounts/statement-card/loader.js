define(["text!./statement-card.html", "./statement-card", "text!./statement-card.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
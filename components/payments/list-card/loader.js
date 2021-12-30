define(["text!./list-card.html", "./list-card", "text!./list-card.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
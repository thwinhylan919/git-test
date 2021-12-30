define(["text!./instructions-details.html", "./instructions-details", "text!./instructions-details.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
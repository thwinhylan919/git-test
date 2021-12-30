define(["text!./personal-details.html", "./personal-details", "text!./personal-details.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
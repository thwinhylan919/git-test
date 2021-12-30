define(["text!./configuration-details.html", "./configuration-details", "text!./configuration-details.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
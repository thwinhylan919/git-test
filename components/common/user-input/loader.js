define(["text!./user-input.html", "./user-input", "text!./user-input.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./loan-calculations.html", "./loan-calculations", "text!./loan-calculations.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
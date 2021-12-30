define(["text!./loan-closed.html", "./loan-closed", "text!./loan-closed.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
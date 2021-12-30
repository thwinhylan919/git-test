define(["text!./transaction-cutoff.html", "./transaction-cutoff", "text!./transaction-cutoff.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
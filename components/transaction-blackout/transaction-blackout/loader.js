define(["text!./transaction-blackout.html", "./transaction-blackout", "text!./transaction-blackout.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
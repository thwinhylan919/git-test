define(["text!./app-tracker-summary.html", "./app-tracker-summary", "text!./app-tracker-summary.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
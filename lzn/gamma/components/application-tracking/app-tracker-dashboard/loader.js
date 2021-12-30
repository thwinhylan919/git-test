define(["text!./app-tracker-dashboard.html", "./app-tracker-dashboard", "text!./app-tracker-dashboard.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
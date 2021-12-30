define(["text!./subscription-dashboard.html", "./subscription-dashboard", "text!./subscription-dashboard.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./dashboard.html", "./dashboard", "text!./dashboard.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
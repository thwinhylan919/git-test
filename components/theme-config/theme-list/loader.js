define(["text!./theme-list.html", "./theme-list", "text!./theme-list.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
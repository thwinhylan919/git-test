define(["text!./locator-index.html", "./locator-index", "text!./locator-index.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
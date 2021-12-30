define(["text!./mapping-update.html", "./mapping-update", "text!./mapping-update.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
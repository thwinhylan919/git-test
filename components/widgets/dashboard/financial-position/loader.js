define(["text!./financial-position.html", "./financial-position", "text!./financial-position.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
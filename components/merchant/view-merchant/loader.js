define(["text!./view-merchant.html", "./view-merchant", "text!./view-merchant.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
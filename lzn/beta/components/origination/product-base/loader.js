define(["text!./product-base.html", "./product-base", "text!./product-base.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
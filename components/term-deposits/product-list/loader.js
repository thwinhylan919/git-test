define(["text!./product-list.html", "./product-list", "text!./product-list.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
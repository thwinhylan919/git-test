define(["text!./user-map.html", "./user-map", "text!./user-map.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
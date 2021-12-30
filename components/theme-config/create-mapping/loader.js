define(["text!./create-mapping.html", "./create-mapping", "text!./create-mapping.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
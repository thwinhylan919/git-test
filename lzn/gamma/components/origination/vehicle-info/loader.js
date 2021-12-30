define(["text!./vehicle-info.html", "./vehicle-info", "text!./vehicle-info.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
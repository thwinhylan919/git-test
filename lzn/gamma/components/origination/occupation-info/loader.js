define(["text!./occupation-info.html", "./occupation-info", "text!./occupation-info.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
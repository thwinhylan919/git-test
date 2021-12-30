define(["text!./report-generation.html", "./report-generation"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
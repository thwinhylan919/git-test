define(["text!./review-report-generation.html", "./review-report-generation", "text!./review-report-generation.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
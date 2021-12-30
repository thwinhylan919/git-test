define(["text!./user-segment-report.html", "./user-segment-report", "text!./user-segment-report.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
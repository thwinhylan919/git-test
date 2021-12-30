define(["text!./audit-log-results.html", "./audit-log-results", "text!./audit-log-results.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
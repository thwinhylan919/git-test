define(["text!./session-summary.html", "./session-summary", "text!./session-summary.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
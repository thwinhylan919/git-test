define(["text!./workflow.html", "./workflow", "text!./workflow.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
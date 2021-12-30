define(["text!./workflow-review.html", "./workflow-review", "text!./workflow-review.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
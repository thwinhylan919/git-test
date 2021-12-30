define(["text!./workflow-list.html", "./workflow-list", "text!./workflow-list.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./workflow-admin.html", "./workflow-admin", "text!./workflow-admin.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
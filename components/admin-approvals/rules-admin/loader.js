define(["text!./rules-admin.html", "./rules-admin", "text!./rules-admin.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
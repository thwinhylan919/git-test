define(["text!./rules-create.html", "./rules-create", "text!./rules-create.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
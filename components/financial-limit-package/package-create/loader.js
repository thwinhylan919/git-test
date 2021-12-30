define(["text!./package-create.html", "./package-create", "text!./package-create.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
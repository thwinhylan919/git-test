define(["text!./rules.html", "./rules", "text!./rules.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
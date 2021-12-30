define(["text!./collection-instructions.html", "./collection-instructions", "text!./collection-instructions.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
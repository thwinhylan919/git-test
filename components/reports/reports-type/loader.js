define(["text!./reports-type.html", "./reports-type", "text!./reports-type.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
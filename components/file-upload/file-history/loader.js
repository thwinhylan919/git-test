define(["text!./file-history.html", "./file-history", "text!./file-history.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
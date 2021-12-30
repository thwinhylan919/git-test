define(["text!./export-lc.html", "./export-lc", "text!./export-lc.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./export-bills.html", "./export-bills", "text!./export-bills.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./import-bills.html", "./import-bills", "text!./import-bills.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
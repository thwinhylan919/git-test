define(["text!./view-bills.html", "./view-bills", "text!./view-bills.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
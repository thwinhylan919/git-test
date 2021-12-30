define(["text!./bill-details.html", "./bill-details", "text!./bill-details.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
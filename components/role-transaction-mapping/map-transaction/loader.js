define(["text!./map-transaction.html", "./map-transaction", "text!./map-transaction.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
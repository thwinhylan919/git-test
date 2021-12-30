define(["text!./payment-domestic.html", "./payment-domestic", "text!./payment-domestic.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
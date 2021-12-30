define(["text!./payment-sepa.html", "./payment-sepa", "text!./payment-sepa.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
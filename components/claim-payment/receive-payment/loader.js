define(["text!./receive-payment.html", "./receive-payment", "text!./receive-payment.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
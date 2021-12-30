define(["text!./bill-payment-report.html", "./bill-payment-report", "text!./bill-payment-report.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
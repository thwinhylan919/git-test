define(["text!./external-payment-report.html", "./external-payment-report", "text!./external-payment-report.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
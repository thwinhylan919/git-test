define(["text!./loan-repayment.html", "./loan-repayment", "text!./loan-repayment.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
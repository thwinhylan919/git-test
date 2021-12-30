define(["text!./sepa-payee.html", "./sepa-payee", "text!./sepa-payee.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
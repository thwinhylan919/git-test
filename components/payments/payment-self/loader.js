define(["text!./payment-self.html", "./payment-self", "text!./payment-self.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
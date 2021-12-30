define(["text!./auto-pay.html", "./auto-pay", "text!./auto-pay.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./scan-to-pay.html", "./scan-to-pay", "text!./scan-to-pay.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
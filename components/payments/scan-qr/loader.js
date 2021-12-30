define(["text!./scan-qr.html", "./scan-qr", "text!./scan-qr.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
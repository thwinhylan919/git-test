define(["text!./wallet-header.html", "./wallet-header", "text!./wallet-header.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
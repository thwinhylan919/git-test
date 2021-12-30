define(["text!./accounts-non-financial.html", "./accounts-non-financial", "text!./accounts-non-financial.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
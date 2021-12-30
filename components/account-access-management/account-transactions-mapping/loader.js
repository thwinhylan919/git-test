define(["text!./account-transactions-mapping.html", "./account-transactions-mapping", "text!./account-transactions-mapping.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./edit-network-rule.html",
    "./edit-network-rule"],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
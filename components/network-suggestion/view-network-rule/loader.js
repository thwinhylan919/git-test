define(["text!./view-network-rule.html",
    "./view-network-rule"],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
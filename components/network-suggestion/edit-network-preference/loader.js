define(["text!./edit-network-preference.html",
    "./edit-network-preference"],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
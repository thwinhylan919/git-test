define(["text!./view-network-preference.html",
    "./view-network-preference"],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
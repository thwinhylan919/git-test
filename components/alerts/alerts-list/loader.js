define(["text!./alerts-list.html", "./alerts-list", "text!./alerts-list.json"],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
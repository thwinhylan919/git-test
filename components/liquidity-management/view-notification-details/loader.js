define(["text!./view-notification-details.html",
    "./view-notification-details"],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
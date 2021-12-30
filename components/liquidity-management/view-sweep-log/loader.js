define(["text!./view-sweep-log.html",
    "./view-sweep-log",
    "baseModel"
  ],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
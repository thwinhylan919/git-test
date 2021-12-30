define(["text!./relationship-mapping-base.html",
    "./relationship-mapping-base",
    "text!./relationship-mapping-base.json"
  ],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
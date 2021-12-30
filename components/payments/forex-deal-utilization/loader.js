define(["text!./forex-deal-utilization.html",
    "./forex-deal-utilization",
    "text!./forex-deal-utilization.json"
  ],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
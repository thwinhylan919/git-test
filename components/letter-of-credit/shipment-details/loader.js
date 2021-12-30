define(["text!./shipment-details.html", "./shipment-details", "text!./shipment-details.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
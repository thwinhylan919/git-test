define(["text!./financial-position-graph.html", "./financial-position-graph", "text!./financial-position-graph.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
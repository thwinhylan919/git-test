define(["text!./report-user-map.html", "./report-user-map", "text!./report-user-map.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
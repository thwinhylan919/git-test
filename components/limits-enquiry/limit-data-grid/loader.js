define([
  "text!./limit-data-grid.html",
  "./limit-data-grid",
  "text!./limit-data-grid.json"
], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
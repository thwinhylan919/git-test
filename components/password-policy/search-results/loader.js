define(["text!./search-results.html", "./search-results", "text!./search-results.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
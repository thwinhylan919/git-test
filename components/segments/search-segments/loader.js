define([
  "text!./search-segments.html",
  "./search-segments",
  "text!./search-segments.json"
], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
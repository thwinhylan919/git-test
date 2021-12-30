define([
  "text!./review-create-segments.html",
  "./review-create-segments",
  "text!./review-create-segments.json"
], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
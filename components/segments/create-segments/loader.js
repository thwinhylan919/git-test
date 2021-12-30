define([
  "text!./create-segments.html",
  "./create-segments",
  "text!./create-segments.json"
], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
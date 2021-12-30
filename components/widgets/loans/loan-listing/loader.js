define(["text!./loan-listing.html", "./loan-listing", "text!./loan-listing.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
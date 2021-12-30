define(["text!./record-listing.html", "./record-listing", "text!./record-listing.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
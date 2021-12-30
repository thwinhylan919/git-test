define(["text!./record-view.html", "./record-view", "text!./record-view.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./activity-log.html", "./activity-log", "text!./activity-log.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./transactions-log.html", "./transactions-log", "text!./transactions-log.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
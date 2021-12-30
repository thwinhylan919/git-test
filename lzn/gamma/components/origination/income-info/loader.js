define(["text!./income-info.html", "./income-info", "text!./income-info.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
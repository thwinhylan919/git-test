define(["text!./advertisements.html", "./advertisements", "text!./advertisements.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
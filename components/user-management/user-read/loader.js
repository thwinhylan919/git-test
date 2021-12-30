define(["text!./user-read.html", "./user-read", "text!./user-read.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
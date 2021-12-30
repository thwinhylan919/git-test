define(["text!./configuration-base.html", "./configuration-base", "text!./configuration-base.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
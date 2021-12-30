define(["text!./template-list.html", "./template-list", "text!./template-list.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
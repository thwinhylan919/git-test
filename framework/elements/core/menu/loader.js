define(["text!./menu.html", "./menu", "text!./menu.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./header-view.html", "./header-view", "text!./header-view.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
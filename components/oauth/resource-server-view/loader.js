define(["text!./resource-server-view.html", "./resource-server-view", "text!./resource-server-view.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
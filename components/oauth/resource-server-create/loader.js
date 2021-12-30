define(["text!./resource-server-create.html", "./resource-server-create", "text!./resource-server-create.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
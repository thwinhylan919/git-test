define(["text!./mapping-create.html", "./mapping-create", "text!./mapping-create.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
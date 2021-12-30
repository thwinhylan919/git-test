define(["text!./identity-info.html", "./identity-info", "text!./identity-info.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./banner.html", "./banner", "text!./banner.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});

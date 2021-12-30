define(["text!./image-caption.html", "./image-caption", "text!./image-caption.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./file-upload.html", "./file-upload", "text!./file-upload.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
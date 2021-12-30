define(["text!./comment-box.html", "./comment-box", "text!./comment-box.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./message-base.html", "./message-base", "text!./message-base.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
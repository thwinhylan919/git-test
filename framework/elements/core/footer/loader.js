define(["text!./footer.html", "./footer", "text!./footer.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
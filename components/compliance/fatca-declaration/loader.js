define(["text!./fatca-declaration.html", "./fatca-declaration", "text!./fatca-declaration.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
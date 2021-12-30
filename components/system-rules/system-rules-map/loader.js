define(["text!./system-rules-map.html", "./system-rules-map", "text!./system-rules-map.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
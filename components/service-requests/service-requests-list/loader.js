define(["text!./service-requests-list.html", "./service-requests-list", "text!./service-requests-list.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
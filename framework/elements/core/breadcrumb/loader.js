define(["text!./breadcrumb.html", "./breadcrumb", "text!./breadcrumb.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
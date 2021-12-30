define(["text!./generic-settings.html", "./generic-settings", "text!./generic-settings.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
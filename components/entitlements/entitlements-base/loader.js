define(["text!./entitlements-base.html", "./entitlements-base", "text!./entitlements-base.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
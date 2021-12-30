define(["text!./preference-base.html", "./preference-base", "text!./preference-base.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
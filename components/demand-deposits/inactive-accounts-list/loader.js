define(["text!./inactive-accounts-list.html", "./inactive-accounts-list", "text!./inactive-accounts-list.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
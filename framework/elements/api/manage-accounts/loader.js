define(["text!./manage-accounts.html", "./manage-accounts", "text!./manage-accounts.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./pending-for-approvals.html", "./pending-for-approvals", "text!./pending-for-approvals.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
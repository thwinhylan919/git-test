define([
  "text!./identity-domain-review.html",
  "./identity-domain-review",
  "text!./identity-domain-review.json"
], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
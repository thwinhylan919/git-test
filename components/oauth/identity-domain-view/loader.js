define([
  "text!./identity-domain-view.html",
  "./identity-domain-view",
  "text!./identity-domain-view.json"
], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
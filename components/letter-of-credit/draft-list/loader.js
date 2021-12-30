define(["text!./draft-list.html", "./draft-list", "text!./draft-list.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
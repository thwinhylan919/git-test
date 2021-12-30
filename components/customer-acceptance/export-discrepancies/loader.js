define(["text!./export-discrepancies.html", "./export-discrepancies", "text!./export-discrepancies.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
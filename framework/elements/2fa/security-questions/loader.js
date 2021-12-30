define(["text!./security-questions.html", "./security-questions", "text!./security-questions.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
define(["text!./application-form.html", "./application-form", "text!./application-form.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
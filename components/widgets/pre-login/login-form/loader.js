define(["text!./login-form.html", "./login-form", "text!./login-form.json"], function(template, viewModel) {
  "use strict";

  return {
    viewModel: viewModel,
    template: template
  };
});
  define(["text!./salutation-view.html", "./salutation-view", "text!./salutation-view.json"], function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
  define(["text!./drop-list-view.html", "./drop-list-view", "text!./drop-list-view.json"], function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
define(["text!./read-nominee.html",
    "./read-nominee",
    "text!./read-nominee.json"
  ],
  function(template, viewModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: template
    };
  });
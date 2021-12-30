define(["module",
    "text!./top-five-sweeps.html",
    "./top-five-sweeps",
    "text!./top-five-sweeps.css",
    "baseModel"
  ],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
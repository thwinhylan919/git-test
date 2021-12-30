define(["module",
    "text!./cross-border-sweeps.html",
    "./cross-border-sweeps",
    "text!./cross-border-sweeps.css",
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
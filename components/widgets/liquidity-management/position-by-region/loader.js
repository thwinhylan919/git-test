define(["module",
    "text!./position-by-region.html",
    "./position-by-region",
    "text!./position-by-region.css",
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
define(["module",
    "text!./view-structure-details.html",
    "text!./view-structure-details.css",
    "baseModel",
    "./view-structure-details",
    "text!./view-structure-details.json"
  ],
  function(module, template, css, BaseModel, viewModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
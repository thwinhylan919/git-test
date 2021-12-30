define(["module",
  "text!./relationship-matrix-mapping.html",
  "./relationship-matrix-mapping",
  "text!./relationship-matrix-mapping.css",
  "baseModel"
], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
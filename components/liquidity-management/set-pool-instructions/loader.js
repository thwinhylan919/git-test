define(["module",
 "text!./set-pool-instructions.html",
  "./set-pool-instructions",
  "text!./set-pool-instructions.css",
  "baseModel"
  ], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
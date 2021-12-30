define(["module",
  "text!./bank-custom-limits.html",
  "./bank-custom-limits",
  "text!./bank-custom-limits.css",
  "baseModel",
  "text!./bank-custom-limits.json"
], function(module,template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

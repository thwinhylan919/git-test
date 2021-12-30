define(["module", "text!./performance-summary.html", "./performance-summary", "text!./performance-summary.css", "baseModel", "text!./performance-summary.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

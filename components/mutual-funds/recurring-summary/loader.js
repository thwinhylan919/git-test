define(["module", "text!./recurring-summary.html", "./recurring-summary", "text!./recurring-summary.css", "baseModel", "text!./recurring-summary.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

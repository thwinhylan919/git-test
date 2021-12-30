define(["module", "text!./portfolio-summary.html", "./portfolio-summary", "text!./portfolio-summary.css", "baseModel", "text!./portfolio-summary.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

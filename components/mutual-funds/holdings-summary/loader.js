define(["module", "text!./holdings-summary.html", "./holdings-summary", "text!./holdings-summary.css", "baseModel", "text!./holdings-summary.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

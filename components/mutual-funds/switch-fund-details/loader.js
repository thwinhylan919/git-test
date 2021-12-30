define(["module", "text!./switch-fund-details.html", "./switch-fund-details", "text!./switch-fund-details.css", "baseModel", "text!./switch-fund-details.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

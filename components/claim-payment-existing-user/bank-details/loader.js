define(["module", "text!./bank-details.html", "./bank-details", "text!./bank-details.css", "baseModel", "text!./bank-details.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
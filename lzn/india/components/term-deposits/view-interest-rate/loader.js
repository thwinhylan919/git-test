define(["module", "text!./view-interest-rate.html", "./view-interest-rate", "text!./view-interest-rate.css", "baseModel", "text!./view-interest-rate.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
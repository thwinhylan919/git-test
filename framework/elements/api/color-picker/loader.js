define(["module", "text!./color-picker.html","text!./color-picker.css", "./color-picker", "baseModel", "text!./color-picker.json"], function(module, template,css, viewModel, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
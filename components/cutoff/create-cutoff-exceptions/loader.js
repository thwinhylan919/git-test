define(["module", "text!./create-cutoff-exceptions.html", "./create-cutoff-exceptions", "text!./create-cutoff-exceptions.css", "baseModel", "text!./create-cutoff-exceptions.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
define(["module", "text!./add-ext-bank.html", "./add-ext-bank", "text!./add-ext-bank.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
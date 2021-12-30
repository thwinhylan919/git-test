define(["module", "text!./user-information.html", "./user-information", "text!./user-information.css", "baseModel", "text!./user-information.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

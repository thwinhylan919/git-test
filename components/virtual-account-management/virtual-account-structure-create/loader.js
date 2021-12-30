define(["module", "text!./virtual-account-structure-create.html", "./virtual-account-structure-create", "text!./virtual-account-structure-create.css", "baseModel", "text!./virtual-account-structure-create.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

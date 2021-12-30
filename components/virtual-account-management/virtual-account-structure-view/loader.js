define(["module", "text!./virtual-account-structure-view.html", "./virtual-account-structure-view", "text!./virtual-account-structure-view.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

define(["module", "text!./virtual-account-cash-position.html", "./virtual-account-cash-position", "text!./virtual-account-cash-position.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

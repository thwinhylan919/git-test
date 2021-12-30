define(["module", "text!./virtual-account-transaction-details.html", "./virtual-account-transaction-details", "text!./virtual-account-transaction-details.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

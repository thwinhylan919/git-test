define(["module", "text!./virtual-account-position-by-currency.html", "./virtual-account-position-by-currency", "text!./virtual-account-position-by-currency.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

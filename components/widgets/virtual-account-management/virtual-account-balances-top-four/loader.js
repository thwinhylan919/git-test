define(["module", "text!./virtual-account-balances-top-four.html", "./virtual-account-balances-top-four", "text!./virtual-account-balances-top-four.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
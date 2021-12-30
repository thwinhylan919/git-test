define(["module", "text!./virtual-multi-currency-account-view.html", "./virtual-multi-currency-account-view", "text!./virtual-multi-currency-account-view.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
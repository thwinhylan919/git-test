define(["module", "text!./virtual-multi-currency-account-search.html", "./virtual-multi-currency-account-search", "text!./virtual-multi-currency-account-search.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
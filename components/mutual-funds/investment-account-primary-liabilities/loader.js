define(["module", "text!./investment-account-primary-liabilities.html", "./investment-account-primary-liabilities", "text!./investment-account-primary-liabilities.css", "baseModel", "text!./investment-account-primary-liabilities.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

define(["module", "text!./investment-account-investments.html", "./investment-account-investments", "text!./investment-account-investments.css", "baseModel", "text!./investment-account-investments.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

define(["module", "text!./investment-account-primary-asset.html", "./investment-account-primary-asset", "text!./investment-account-primary-asset.css", "baseModel", "text!./investment-account-primary-asset.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

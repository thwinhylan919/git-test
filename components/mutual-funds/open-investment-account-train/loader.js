define(["module", "text!./open-investment-account-train.html", "./open-investment-account-train", "text!./open-investment-account-train.css", "baseModel", "text!./open-investment-account-train.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

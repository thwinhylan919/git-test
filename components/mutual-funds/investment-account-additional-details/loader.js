define(["module", "text!./investment-account-additional-details.html", "./investment-account-additional-details", "text!./investment-account-additional-details.css", "baseModel", "text!./investment-account-additional-details.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

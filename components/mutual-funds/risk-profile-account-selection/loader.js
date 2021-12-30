define(["module", "text!./risk-profile-account-selection.html", "./risk-profile-account-selection", "text!./risk-profile-account-selection.css", "baseModel", "text!./risk-profile-account-selection.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

define(["module", "text!./investment-account-relatives.html", "./investment-account-relatives", "text!./investment-account-relatives.css", "baseModel", "text!./investment-account-relatives.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

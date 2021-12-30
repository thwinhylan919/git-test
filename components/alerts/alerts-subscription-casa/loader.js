define(["module", "text!./alerts-subscription-casa.html", "./alerts-subscription-casa", "text!./alerts-subscription-casa.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
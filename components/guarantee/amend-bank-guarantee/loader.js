define(["module", "text!./amend-bank-guarantee.html", "./amend-bank-guarantee", "text!./amend-bank-guarantee.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
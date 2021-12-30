define(["module", "text!./amend-letter-of-credit.html", "./amend-letter-of-credit", "text!./amend-letter-of-credit.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
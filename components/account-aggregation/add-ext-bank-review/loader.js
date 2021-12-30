define(["module", "text!./add-ext-bank-review.html", "./add-ext-bank-review", "text!./add-ext-bank-review.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
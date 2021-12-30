define(["module", "text!./review.html", "text!./review.css", "./review", "baseModel"], function(module, template, css, viewModel, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
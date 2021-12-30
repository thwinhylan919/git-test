define(["module", "text!./review-exception-working-window.html", "./review-exception-working-window", "text!./review-exception-working-window.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
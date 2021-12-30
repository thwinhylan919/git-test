define(["module", "text!./review-linked-user-access-management.html", "./review-linked-user-access-management", "text!./review-linked-user-access-management.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
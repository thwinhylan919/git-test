define([
  "module",
  "text!./invoice-update-status-review.html",
  "./invoice-update-status-review",
  "text!./invoice-update-status-review.css",
  "baseModel"
], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

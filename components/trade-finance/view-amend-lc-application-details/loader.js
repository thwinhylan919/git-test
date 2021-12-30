define(["module", "text!./view-amend-lc-application-details.html", "./view-amend-lc-application-details", "text!./view-amend-lc-application-details.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
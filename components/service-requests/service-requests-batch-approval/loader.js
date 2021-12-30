define(["module", "text!./service-requests-batch-approval.html", "./service-requests-batch-approval", "text!./service-requests-batch-approval.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
define(["module", "text!./loan-details.html", "./loan-details", "text!./loan-details.css","baseModel"], function(module,template, viewModel,css,BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

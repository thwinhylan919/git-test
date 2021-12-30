define(["module", "text!./record-list-financial.html", "./record-list-financial", "text!./record-list-financial.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
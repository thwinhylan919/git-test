define(["module", "text!./business-detail.html", "./business-detail", "text!./business-detail.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
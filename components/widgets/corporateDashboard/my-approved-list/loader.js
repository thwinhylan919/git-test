define(["module", "text!./my-approved-list.html", "./my-approved-list", "text!./my-approved-list.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
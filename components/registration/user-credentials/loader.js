define(["module","text!./user-credentials.html", "./user-credentials", "text!./user-credentials.css" ,"baseModel", "text!./user-credentials.json"], function(module,template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
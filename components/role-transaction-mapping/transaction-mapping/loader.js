define(["module", "text!./transaction-mapping.html", "./transaction-mapping", "text!./transaction-mapping.css", "baseModel", "text!./transaction-mapping.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
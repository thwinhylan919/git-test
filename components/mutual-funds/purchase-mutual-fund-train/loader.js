define(["module", "text!./purchase-mutual-fund-train.html", "./purchase-mutual-fund-train", "text!./purchase-mutual-fund-train.css", "baseModel", "text!./purchase-mutual-fund-train.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
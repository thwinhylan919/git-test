define(["module", "text!./fund-transfer-view-details.html", "./fund-transfer-view-details", "text!./fund-transfer-view-details.css", "baseModel", "text!./fund-transfer-view-details.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

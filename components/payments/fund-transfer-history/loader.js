define(["module", "text!./fund-transfer-history.html", "./fund-transfer-history", "text!./fund-transfer-history.css", "baseModel", "text!./fund-transfer-history.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

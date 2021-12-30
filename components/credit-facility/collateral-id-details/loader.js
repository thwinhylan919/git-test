
define(["module", "text!./collateral-id-details.html", "./collateral-id-details", "text!./collateral-id-details.css", "baseModel", "text!./collateral-id-details.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
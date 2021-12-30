define(["module", "text!./redeem-fund-details.html", "./redeem-fund-details", "text!./redeem-fund-details.css", "baseModel", "text!./redeem-fund-details.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

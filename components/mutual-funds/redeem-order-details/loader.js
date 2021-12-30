define(["module", "text!./redeem-order-details.html", "./redeem-order-details", "text!./redeem-order-details.css", "baseModel", "text!./redeem-order-details.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

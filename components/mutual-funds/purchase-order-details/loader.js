  define(["module", "text!./purchase-order-details.html", "./purchase-order-details", "text!./purchase-order-details.css", "baseModel", "text!./purchase-order-details.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
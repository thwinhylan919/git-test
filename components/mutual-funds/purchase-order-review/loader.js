  define(["module", "text!./purchase-order-review.html", "./purchase-order-review", "text!./purchase-order-review.css", "baseModel", "text!./purchase-order-review.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
  define(["module", "text!./order-status-review.html", "./order-status-review", "text!./order-status-review.css", "baseModel", "text!./order-status-review.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

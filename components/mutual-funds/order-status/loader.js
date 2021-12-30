  define(["module", "text!./order-status.html", "./order-status", "text!./order-status.css", "baseModel", "text!./order-status.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

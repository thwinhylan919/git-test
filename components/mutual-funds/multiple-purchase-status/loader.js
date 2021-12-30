define(["module", "text!./multiple-purchase-status.html", "./multiple-purchase-status", "text!./multiple-purchase-status.css", "baseModel", "text!./multiple-purchase-status.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
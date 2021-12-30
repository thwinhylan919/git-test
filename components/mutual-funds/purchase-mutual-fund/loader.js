  define(["module", "text!./purchase-mutual-fund.html", "./purchase-mutual-fund", "text!./purchase-mutual-fund.css", "baseModel", "text!./purchase-mutual-fund.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
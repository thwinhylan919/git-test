define(["module", "text!./virtual-account-balance-trends.html", "./virtual-account-balance-trends", "text!./virtual-account-balance-trends.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

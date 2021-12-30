define(["module", "text!./add-collateral.html", "./add-collateral", "text!./add-collateral.css", "baseModel", "text!./add-collateral.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

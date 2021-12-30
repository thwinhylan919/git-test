
define(["module", "text!./collateral-overview.html", "./collateral-overview", "text!./collateral-overview.css", "baseModel", "text!./collateral-overview.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

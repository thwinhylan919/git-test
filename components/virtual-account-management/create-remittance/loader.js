define(["module", "text!./create-remittance.html", "./create-remittance", "text!./create-remittance.css", "baseModel", "text!./create-remittance.json"],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

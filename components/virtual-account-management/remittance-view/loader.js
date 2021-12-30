define(["module", "text!./remittance-view.html", "./remittance-view", "text!./remittance-view.css", "baseModel", "text!./remittance-view.json"],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
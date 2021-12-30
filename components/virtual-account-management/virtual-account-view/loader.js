define(["module", "text!./virtual-account-view.html", "./virtual-account-view", "text!./virtual-account-view.css", "baseModel", "text!./virtual-account-view.json"],
  function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
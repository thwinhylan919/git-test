define(["module", "text!./access-denied.html", "./access-denied", "baseModel", "text!./access-denied.css"], function(module, template, viewModel, BaseModel, css) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
define(["module", "text!./facility-covenants.html", "./facility-covenants", "text!./facility-covenants.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
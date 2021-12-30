  define(["module", "text!./section-header-control.html", "./section-header-control", "text!./section-header-control.css", "baseModel", "text!./section-header-control.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
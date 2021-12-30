  define(["module", "text!./alerts-maintenance-search.html", "./alerts-maintenance-search", "text!./alerts-maintenance-search.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
  define(["module", "text!./scheme-details-bar.html", "./scheme-details-bar", "text!./scheme-details-bar.css", "baseModel", "text!./scheme-details-bar.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
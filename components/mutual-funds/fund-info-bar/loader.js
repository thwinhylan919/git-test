  define(["module", "text!./fund-info-bar.html", "./fund-info-bar", "text!./fund-info-bar.css", "baseModel", "text!./fund-info-bar.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

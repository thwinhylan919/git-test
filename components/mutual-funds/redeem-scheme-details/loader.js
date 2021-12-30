  define(["module", "text!./redeem-scheme-details.html", "./redeem-scheme-details", "text!./redeem-scheme-details.css", "baseModel", "text!./redeem-scheme-details.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
  define(["module", "text!./investment-account-fatca.html", "./investment-account-fatca", "text!./investment-account-fatca.css", "baseModel", "text!./investment-account-fatca.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

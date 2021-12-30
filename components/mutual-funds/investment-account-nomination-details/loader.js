  define(["module", "text!./investment-account-nomination-details.html", "./investment-account-nomination-details", "text!./investment-account-nomination-details.css", "baseModel", "text!./investment-account-nomination-details.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

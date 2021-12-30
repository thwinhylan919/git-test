  define(["module", "text!./investment-account-review.html", "./investment-account-review", "text!./investment-account-review.css", "baseModel", "text!./investment-account-review.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });

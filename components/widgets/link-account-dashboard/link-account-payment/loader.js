define(["module",
    "text!./link-account-payment.html",
    "./link-account-payment",
    "text!./link-account-payment.css",
    "baseModel"
  ],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
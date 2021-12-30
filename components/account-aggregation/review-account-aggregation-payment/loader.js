define(["module",
    "text!./review-account-aggregation-payment.html",
    "./review-account-aggregation-payment",
    "text!./review-account-aggregation-payment.css",
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
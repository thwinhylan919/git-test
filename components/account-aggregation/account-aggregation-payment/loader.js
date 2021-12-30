define(["module",
    "text!./account-aggregation-payment.html",
    "./account-aggregation-payment",
    "text!./account-aggregation-payment.css",
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
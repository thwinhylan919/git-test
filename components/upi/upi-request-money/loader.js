define([
  "module",
  "baseModel",
  "text!./init.html",
  "./init",
  "text!./review.html",
  "./review",
  "text!./upi-request-money.css"
], function (module,BaseModel,transactionInitTemplate, transactionInitViewModel, transactionReviewTemplate, transactionReviewViewModel,cssTemplate) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return function (config) {
    if (config.type === "init") {
      return {
        viewModel: transactionInitViewModel,
        template: baseModel.transformTemplate(transactionInitTemplate, cssTemplate,baseModel.getComponentName(module))
      };
    }

    return {
      viewModel: transactionReviewViewModel,
      template: transactionReviewTemplate
    };
  };
});

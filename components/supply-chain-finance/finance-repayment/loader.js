define([
  "module",
  "text!./finance-repayment-create.html",
  "./finance-repayment-create",
  "text!./finance-repayment.css",
  "text!./review-finance-repayment.html",
  "./review-finance-repayment",
  "baseModel"
], function (module, transactionInitTemplate, transactionInitViewModel, transactionInitCss, transactionReviewTemplate, transactionReviewViewModel, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return function (config) {
    if (config.type === "init") {
      return {
        viewModel: transactionInitViewModel,
        template: baseModel.transformTemplate(transactionInitTemplate, transactionInitCss, baseModel.getComponentName(module, config))
      };
    }

    return {
      viewModel: transactionReviewViewModel,
      template: baseModel.transformTemplate(transactionReviewTemplate, transactionInitCss, baseModel.getComponentName(module, config))
    };
  };
});
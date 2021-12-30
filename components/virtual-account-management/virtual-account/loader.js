define([
  "module",
  "text!./virtual-account-create.html",
  "./virtual-account-create",
  "text!./virtual-account.css",
  "text!./review-virtual-account.html",
  "./review-virtual-account",
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
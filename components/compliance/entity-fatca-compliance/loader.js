define([
    "module",
    "text!./init.html",
    "./init",
    "text!./review.html",
    "./review",
    "text!./entity-fatca-compliance.css",
    "baseModel",
    "text!./entity-fatca-compliance.json"
  ],
  function (module, transactionInitTemplate, transactionInitViewModel, transactionReviewTemplate, transactionReviewViewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return function (config) {
      if (config.type === "init") {
        return {
          viewModel: transactionInitViewModel,
          template: baseModel.transformTemplate(transactionInitTemplate, css, baseModel.getComponentName(module))
        };
      }

      return {
        viewModel: transactionReviewViewModel,
        template: baseModel.transformTemplate(transactionReviewTemplate, css, baseModel.getComponentName(module))
      };
    };
  });
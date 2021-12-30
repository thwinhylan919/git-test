  define(["module", "text!./review-demand-draft-payee.html", "./review-demand-draft-payee", "text!./review-demand-draft-payee.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
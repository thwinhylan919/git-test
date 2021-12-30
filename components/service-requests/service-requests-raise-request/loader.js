  define(["module", "text!./service-requests-raise-request.html", "./service-requests-raise-request", "text!./service-requests-raise-request.css", "baseModel", "text!./service-requests-raise-request.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
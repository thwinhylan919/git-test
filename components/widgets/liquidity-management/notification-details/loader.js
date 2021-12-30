define(["module",
    "text!./notification-details.html",
    "./notification-details",
    "text!./notification-details.css",
    "baseModel"],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
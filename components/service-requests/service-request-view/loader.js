define(["module", "text!./service-request-view.html", "./service-request-view", "text!./service-request-view.css", "baseModel", "text!./service-request-view.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
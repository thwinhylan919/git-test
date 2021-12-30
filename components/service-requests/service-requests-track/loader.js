define(["module", "text!./service-requests-track.html", "./service-requests-track", "text!./service-requests-track.css", "baseModel", "text!./service-requests-track.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
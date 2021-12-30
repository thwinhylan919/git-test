define(["module", "text!./create-standard-work-window.html", "./create-standard-work-window", "text!./create-standard-work-window.css", "baseModel", "text!./create-standard-work-window.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
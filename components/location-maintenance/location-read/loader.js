define(["module", "text!./location-read.html", "./location-read", "text!./location-read.css", "baseModel", "text!./location-read.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
define(["module", "text!./structure-configuration.html", "./structure-configuration", "text!./structure-configuration.css", "baseModel", "text!./structure-configuration.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

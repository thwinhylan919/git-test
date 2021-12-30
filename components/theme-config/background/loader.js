define(["module", "text!./background.html", "./background", "baseModel", "text!./background.css"], function(module, template, viewModel, BaseModel, css) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
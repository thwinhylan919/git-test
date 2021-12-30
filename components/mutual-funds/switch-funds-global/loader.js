define(["module", "text!./switch-funds-global.html", "./switch-funds-global", "text!./switch-funds-global.css", "baseModel", "text!./switch-funds-global.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

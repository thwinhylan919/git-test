define(["module", "text!./card-addon.html", "./card-addon", "text!./card-addon.css", "baseModel", "text!./card-addon.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template:  baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
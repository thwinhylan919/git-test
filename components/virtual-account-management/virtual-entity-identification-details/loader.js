define(["module", "text!./virtual-entity-identification-details.html", "./virtual-entity-identification-details", "text!./virtual-entity-identification-details.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
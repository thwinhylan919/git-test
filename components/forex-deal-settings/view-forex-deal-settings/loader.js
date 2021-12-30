define(["module", "text!./view-forex-deal-settings.html", "./view-forex-deal-settings", "text!./view-forex-deal-settings.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});